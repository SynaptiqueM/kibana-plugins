/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AppMountParameters, CoreSetup, CoreStart } from '@kbn/core/public';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';

import { KibanaContextProvider, KibanaThemeProvider } from '@kbn/kibana-react-plugin/public';
import { Storage } from '@kbn/kibana-utils-plugin/public';
import { RouteRenderer, RouterProvider } from '@kbn/typed-react-router-config';

import { RedirectAppLinks } from '@kbn/shared-ux-link-redirect-app';
import { ProfilingDependenciesContextProvider } from './components/contexts/profiling_dependencies/profiling_dependencies_context';
import { RedirectWithDefaultDateRange } from './components/redirect_with_default_date_range';
import { profilingRouter } from './routing';
import { Services } from './services';
import { ProfilingPluginPublicSetupDeps, ProfilingPluginPublicStartDeps } from './types';

interface Props {
  profilingFetchServices: Services;
  coreStart: CoreStart;
  coreSetup: CoreSetup;
  pluginsStart: ProfilingPluginPublicStartDeps;
  pluginsSetup: ProfilingPluginPublicSetupDeps;
  theme$: AppMountParameters['theme$'];
  history: AppMountParameters['history'];
}

const storage = new Storage(localStorage);

function App({
  coreStart,
  coreSetup,
  pluginsStart,
  pluginsSetup,
  profilingFetchServices,
  theme$,
  history,
}: Props) {
  const profilingDependencies = useMemo(() => {
    return {
      start: {
        core: coreStart,
        ...pluginsStart,
      },
      setup: {
        core: coreSetup,
        ...pluginsSetup,
      },
      services: profilingFetchServices,
    };
  }, [coreStart, coreSetup, pluginsStart, pluginsSetup, profilingFetchServices]);

  return (
    <KibanaThemeProvider theme$={theme$}>
      <KibanaContextProvider services={{ ...coreStart, ...pluginsStart, storage }}>
        <RedirectAppLinks coreStart={coreStart} currentAppId="profiling">
          <RouterProvider router={profilingRouter as any} history={history}>
            <ProfilingDependenciesContextProvider value={profilingDependencies}>
              <RedirectWithDefaultDateRange>
                <RouteRenderer />
              </RedirectWithDefaultDateRange>
            </ProfilingDependenciesContextProvider>
          </RouterProvider>
        </RedirectAppLinks>
      </KibanaContextProvider>
    </KibanaThemeProvider>
  );
}

export const renderApp = (props: Props, element: AppMountParameters['element']) => {
  ReactDOM.render(<App {...props} />, element);

  return () => ReactDOM.unmountComponentAtNode(element);
};
