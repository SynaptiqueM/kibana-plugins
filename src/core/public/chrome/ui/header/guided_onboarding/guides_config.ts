/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export type UseCase = 'observability' | 'security' | 'search';
export type StepStatus = 'incomplete' | 'complete' | 'in_progress';
export interface StepConfig {
  id: string;
  title: string;
  description: string;
  url: string;
  status?: StepStatus;
}
export interface GuideConfig {
  useCase: UseCase;
  title: string;
  description: string;
  docs?: {
    text: string;
    url: string;
  };
  steps: StepConfig[];
}
export const guidesConfig: GuideConfig[] = [
  {
    useCase: 'observability',
    title: 'Observe my infrastructure',
    description:
      'The foundation of seeing Elastic in action, is adding you own data. Follow links to our documents below to learn more.',
    docs: {
      text: 'Observability 101 Documentation',
      url: 'example.com',
    },
    steps: [
      {
        id: 'add_data',
        title: 'Add data',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
        url: '/app/integrations/browse',
      },
      {
        id: 'rules',
        title: 'Customize your alerting rules',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
        url: '/app/observability/alerts',
      },
      {
        id: 'infrastructure',
        title: 'View infrastructure details',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
        url: '/app/observability/alerts',
      },
      {
        id: 'explore',
        title: 'Explore Discover and Dashboards',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
        url: '/app/observability/alerts',
      },
      {
        id: 'tour',
        title: 'Tour Observability',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
        url: '/app/observability/alerts',
      },
      {
        id: 'do_more',
        title: 'Do more with Observability',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
        url: '/app/observability/alerts',
      },
    ],
  },
  {
    useCase: 'security',
    title: 'Get started with SIEM',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
    steps: [
      {
        id: 'add_data',
        title: 'Add and view your data',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ligula enim, malesuada a finibus vel, cursus sed risus. Vivamus pretium, elit dictum lacinia aliquet, libero nibh dictum enim, a rhoncus leo magna in sapien.',
        url: '/app/integrations/browse',
      },
      {
        id: 'rules',
        title: 'Turn on rules',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        url: '/app/security/rules',
      },
      {
        id: 'alerts',
        title: 'View Alerts',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        url: '/app/security/rules',
      },
      {
        id: 'cases',
        title: 'Cases and investigations',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        url: '/app/security/rules',
      },
      {
        id: 'do_more',
        title: 'Do more with Elastic Security',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        url: '/app/security/rules',
      },
    ],
  },
];
