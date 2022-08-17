/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState } from 'react';
import { css } from '@emotion/react';
import {
  EuiPopover,
  EuiPopoverTitle,
  EuiPopoverFooter,
  EuiButton,
  EuiText,
  EuiProgress,
  EuiAccordion,
  EuiHorizontalRule,
  EuiSpacer,
  EuiTextColor,
  htmlIdGenerator,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  useEuiTheme,
  EuiButtonEmpty,
  EuiTitle,
} from '@elastic/eui';

import { Observable } from 'rxjs';
import useObservable from 'react-use/lib/useObservable';
import type { HttpStart } from '@kbn/core-http-browser';

import { guidesConfig } from './guides_config';
import type { GuideConfig, StepStatus } from './guides_config';
import type { OnboardingGuide } from '../../../types';

// interface GuidedOnboardingState {
//   active_guide: UseCase;
//   active_step: string;
// }

interface Props {
  http: HttpStart;
  onboardingGuide$: Observable<OnboardingGuide>;
}

const getConfig = (state?: OnboardingGuide): GuideConfig | undefined => {
  if (!state) {
    return undefined;
  }
  return guidesConfig[state.active_guide];
};

const getStepStatus = (stepIndex: number, activeStep?: number): StepStatus => {
  if (isNaN(Number(activeStep))) {
    return 'incomplete';
  }
  if (Number(activeStep) === stepIndex + 1 || (Number(activeStep) < 1 && stepIndex === 0)) {
    return 'in_progress';
  }
  return Number(activeStep) > stepIndex + 1 ? 'complete' : 'incomplete';
};

export const HeaderOnboardingButton = ({ onboardingGuide$ }: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const onboardingGuide = useObservable(onboardingGuide$);

  // const [guidedOnboardingState, setGuidedOnboardingState] = useState<
  //   GuidedOnboardingState | undefined
  // >(undefined);

  // useEffect(() => {
  //   http.get<{ state: GuidedOnboardingState }>('/api/guided_onboarding/state').then((res) => {
  //     setGuidedOnboardingState(res.state);
  //   });
  // }, [http, setGuidedOnboardingState]);

  const { euiTheme } = useEuiTheme();

  const togglePopover = () => {
    setIsPopoverOpen((prevIsPopoverOpen) => !prevIsPopoverOpen);
  };

  const popoverContainerCss = css`
    width: 400px;
  `;

  const statusCircleCss = ({ status }: { status: StepStatus }) => css`
    width: 24px;
    height: 24px;
    border-radius: 32px;
    ${(status === 'complete' || status === 'in_progress') &&
    `background-color: ${euiTheme.colors.success};`}
    ${status === 'incomplete' &&
    `
      border: 2px solid ${euiTheme.colors.lightShade};
    `}
  `;

  const guideConfig = getConfig(onboardingGuide);

  return guideConfig ? (
    <EuiPopover
      button={
        <EuiButton onClick={togglePopover} color="success" fill>
          Guided setup
        </EuiButton>
      }
      isOpen={isPopoverOpen}
      closePopover={() => setIsPopoverOpen(false)}
      anchorPosition="downRight"
      hasArrow={false}
      offset={10}
      panelPaddingSize="l"
    >
      <EuiPopoverTitle>
        <EuiButtonEmpty
          onClick={() => {}}
          iconSide="left"
          iconType="arrowLeft"
          isDisabled={true}
          flush="left"
        >
          Back to guides
        </EuiButtonEmpty>
        <EuiTitle size="m">
          <h3>{guideConfig?.title}</h3>
        </EuiTitle>
      </EuiPopoverTitle>

      <div css={popoverContainerCss}>
        <EuiText>
          <p>{guideConfig?.description}</p>
        </EuiText>
        <EuiSpacer />
        <EuiHorizontalRule />
        <EuiProgress label="Progress" value={40} max={100} size="l" valueText />
        <EuiSpacer size="xl" />
        {guideConfig?.steps.map((step, index) => {
          const accordionId = htmlIdGenerator(`accordion${index}`)();

          const stepStatus = getStepStatus(index, onboardingGuide?.active_step);
          const buttonContent = (
            <EuiFlexGroup gutterSize="s">
              <EuiFlexItem grow={false}>
                <span css={statusCircleCss({ status: stepStatus })} className="eui-textCenter">
                  <span className="euiScreenReaderOnly">{stepStatus}</span>
                  {stepStatus === 'complete' && <EuiIcon type="check" color="white" />}
                </span>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>{step.title}</EuiFlexItem>
            </EuiFlexGroup>
          );

          return (
            <div>
              <EuiAccordion id={accordionId} buttonContent={buttonContent} arrowDisplay="right">
                <>
                  <EuiSpacer size="s" />
                  <EuiText size="s">{step.description}</EuiText>
                </>
              </EuiAccordion>

              {/* Do not show horizontal rule for last item */}
              {guideConfig.steps.length - 1 !== index && <EuiHorizontalRule />}
            </div>
          );
        })}
        <EuiPopoverFooter>
          <EuiText size="xs" textAlign="center">
            <EuiTextColor color="subdued">
              <p>{`Got questions? We're here to help.`}</p>
            </EuiTextColor>
          </EuiText>
        </EuiPopoverFooter>
      </div>
    </EuiPopover>
  ) : (
    <EuiButton onClick={togglePopover} color="success" fill isDisabled={true}>
      Guided setup
    </EuiButton>
  );
};
