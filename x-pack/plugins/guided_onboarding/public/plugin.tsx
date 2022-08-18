/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import ReactDOM from 'react-dom';
import React from 'react';
import * as Rx from 'rxjs';
import { i18n } from '@kbn/i18n';
import { I18nProvider } from '@kbn/i18n-react';
import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  Plugin,
  CoreTheme,
  HttpStart,
} from '@kbn/core/public';
import { KibanaThemeProvider } from '@kbn/kibana-react-plugin/public';

import {
  GuidedOnboardingPluginSetup,
  GuidedOnboardingPluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME } from '../common';
import { GuidedOnboardingButton } from './components';

export class GuidedOnboardingPlugin
  implements Plugin<GuidedOnboardingPluginSetup, GuidedOnboardingPluginStart>
{
  public setup(core: CoreSetup): GuidedOnboardingPluginSetup {
    // TODO remove this eventually
    // Register an application into the side navigation menu
    core.application.register({
      id: 'guidedOnboarding',
      title: PLUGIN_NAME,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('guidedOnboarding.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): GuidedOnboardingPluginStart {
    core.chrome.navControls.registerRight({
      order: 1000,
      mount: (target) => this.mount(target, core.theme.theme$, core.http),
    });

    return {};
  }

  public stop() {}

  private mount(targetDomElement: HTMLElement, theme$: Rx.Observable<CoreTheme>, http: HttpStart) {
    ReactDOM.render(
      <KibanaThemeProvider theme$={theme$}>
        <I18nProvider>
          <GuidedOnboardingButton http={http} />
        </I18nProvider>
      </KibanaThemeProvider>,
      targetDomElement
    );
    return () => ReactDOM.unmountComponentAtNode(targetDomElement);
  }
}
