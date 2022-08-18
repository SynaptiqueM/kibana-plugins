/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { NavigationPublicPluginStart } from '@kbn/navigation-plugin/public';

export interface GuidedOnboardingPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GuidedOnboardingPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

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
  title: string;
  description: string;
  docs?: {
    text: string;
    url: string;
  };
  steps: StepConfig[];
}
