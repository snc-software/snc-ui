import { Check, NavArrowLeft, NavArrowRight } from 'iconoir-react';
import { useState } from 'react';

import Button from '@/Components/Button';
import { cn } from '@/Utils/cn';

import { IconSize } from './Wizard.constants';
import { classes } from './Wizard.styles';

import type { WizardProps } from './Wizard.types';

/**
 * A multi-step flow that renders one step's content at a time behind a footer of navigation
 * actions (`Back`/`Cancel`/`Next`) that adapts to the active step, replacing `Next` with the
 * consumer-supplied `completionActions` on the last step. Progress is shown as an icon-based
 * marker row rather than "Step X of Y" text.
 */
export default function Wizard({
  steps,
  currentStep,
  defaultCurrentStep = 1,
  onStepChanged,
  onCancel,
  completionActions,
  cancelLabel = 'Cancel',
  nextLabel = 'Next',
  backLabel = 'Back',
  className,
  ...rest
}: WizardProps) {
  const [uncontrolledCurrentStep, setUncontrolledCurrentStep] = useState(defaultCurrentStep);

  // Controlled as soon as `currentStep` is supplied, as `Accordion`'s `openItems` behaves.
  const activeStep = currentStep ?? uncontrolledCurrentStep;
  const currentIndex = activeStep - 1;
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  const canProceed = steps[currentIndex]?.canProceed?.() ?? true;

  const goToStep = (step: number) => {
    if (currentStep === undefined) {
      setUncontrolledCurrentStep(step);
    }

    onStepChanged?.(step);
  };

  return (
    <div className={cn(classes.root, className)} {...rest}>
      <ol className={classes.progressList}>
        {steps.map((_step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={index} className={classes.progressItem}>
              <span
                className={cn(
                  classes.marker,
                  isCompleted && classes.markerCompleted,
                  isCurrent && classes.markerCurrent,
                  !isCompleted && !isCurrent && classes.markerUpcoming,
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check width={IconSize} height={IconSize} aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{index + 1}</span>
                )}
                <span className={classes.markerLabel}>
                  {`Step ${index + 1}${isCurrent ? ', current' : isCompleted ? ', completed' : ''}`}
                </span>
              </span>
              {index < steps.length - 1 && (
                <span className={classes.progressConnector} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <div className={classes.content}>{steps[currentIndex]?.content}</div>
      <div className={classes.divider} />
      <div className={classes.footer}>
        <div className={classes.actionGroup}>
          {!isFirstStep && (
            <Button
              variant="secondary"
              onClick={() => goToStep(activeStep - 1)}
              icon={<NavArrowLeft width={IconSize} height={IconSize} />}
            >
              {backLabel}
            </Button>
          )}
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
        <div className={classes.actionGroup}>
          {isLastStep ? (
            completionActions.map((action, index) => (
              <Button
                key={action.key}
                variant={
                  action.variant ??
                  (index === completionActions.length - 1 ? 'primary' : 'secondary')
                }
                onClick={action.onClick}
                isLoading={action.isLoading}
                disabled={action.disabled || !canProceed}
              >
                {action.label}
              </Button>
            ))
          ) : (
            <Button
              variant="primary"
              onClick={() => goToStep(activeStep + 1)}
              disabled={!canProceed}
              icon={<NavArrowRight width={IconSize} height={IconSize} />}
              iconPosition="trailing"
            >
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
