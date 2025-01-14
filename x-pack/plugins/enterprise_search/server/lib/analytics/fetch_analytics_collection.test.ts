/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { IScopedClusterClient } from '@kbn/core-elasticsearch-server';

import { ANALYTICS_COLLECTIONS_INDEX } from '../..';

import { fetchAnalyticsCollectionByName } from './fetch_analytics_collection';
import { setupAnalyticsCollectionIndex } from './setup_indices';

jest.mock('./setup_indices', () => ({
  setupAnalyticsCollectionIndex: jest.fn(),
}));

describe('fetch analytics collection lib function', () => {
  const mockClient = {
    asCurrentUser: {
      search: jest.fn(),
    },
    asInternalUser: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch collection by name', () => {
    it('should fetch analytics collection by name', async () => {
      mockClient.asCurrentUser.search.mockImplementationOnce(() =>
        Promise.resolve({ hits: { hits: [{ _id: 'fakeId', _source: { name: 'example' } }] } })
      );

      await expect(
        fetchAnalyticsCollectionByName(mockClient as unknown as IScopedClusterClient, 'example')
      ).resolves.toEqual({ id: 'fakeId', name: 'example' });

      expect(mockClient.asCurrentUser.search).toHaveBeenCalledWith({
        index: ANALYTICS_COLLECTIONS_INDEX,
        query: {
          term: {
            name: 'example',
          },
        },
      });
    });

    it('should call setup analytics collection index on index not found error', async () => {
      mockClient.asCurrentUser.search.mockImplementationOnce(() =>
        Promise.reject({
          meta: {
            body: {
              error: { type: 'index_not_found_exception' },
            },
          },
        })
      );
      await expect(
        fetchAnalyticsCollectionByName(mockClient as unknown as IScopedClusterClient, 'example')
      ).resolves.toEqual(undefined);
      expect(mockClient.asCurrentUser.search).toHaveBeenCalledWith({
        index: ANALYTICS_COLLECTIONS_INDEX,
        query: {
          term: {
            name: 'example',
          },
        },
      });
      expect(setupAnalyticsCollectionIndex as jest.Mock).toHaveBeenCalledWith(
        mockClient.asCurrentUser
      );
    });

    it('should not call setup connectors on other errors', async () => {
      mockClient.asCurrentUser.search.mockImplementationOnce(() =>
        Promise.reject({
          meta: {
            body: {
              error: {
                type: 'other error',
              },
            },
          },
        })
      );
      await expect(fetchAnalyticsCollectionByName(mockClient as any, 'example')).resolves.toEqual(
        undefined
      );
      expect(mockClient.asCurrentUser.search).toHaveBeenCalledWith({
        index: ANALYTICS_COLLECTIONS_INDEX,
        query: {
          term: {
            name: 'example',
          },
        },
      });
      expect(setupAnalyticsCollectionIndex as jest.Mock).not.toHaveBeenCalled();
    });
  });
});
