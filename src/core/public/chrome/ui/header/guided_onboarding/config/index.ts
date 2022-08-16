/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { securityConfig } from './security';
import { observabilityConfig } from './observability';
import type { GuideConfig, UseCase } from './types';


interface GuidesConfig {
  [keyof UseCase]: GuideConfig
}

export const guidesConfig = {
  security: securityConfig,
  observability: observabilityConfig,
};

export type { GuideConfig, StepStatus, UseCase } from './types';
