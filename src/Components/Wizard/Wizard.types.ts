import type { ButtonProps } from '@/Components/Button';
import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

export type WizardStep = {
  /** Rendered as the content for this step while it is active. */
  content: ReactNode;
  /**
   * Called while this step is active to determine whether Next (or, on the last step, every
   * completion action) is enabled. Omit for a step that never blocks advancement.
   * Mirrors the legacy `FormWizard`'s per-step `canProceed` field.
   */
  canProceed?: () => boolean;
};

export type WizardCompletionAction = {
  /** Stable React key for this action. */
  key: string;
  /** Button label. */
  label: string;
  /** Called when the action is activated. */
  onClick: () => void;
  /**
   * Passed through to the underlying Button. Defaults to `'secondary'`, except the last action
   * in the array, which defaults to `'primary'`.
   */
  variant?: ButtonProps['variant'];
  isLoading?: boolean;
  disabled?: boolean;
};

export type WizardProps = SncComponent<{
  /** The steps to render, in order. The array length is the total step count. */
  steps: WizardStep[];
  /** Controlled usage: the active step number (1-based). */
  currentStep?: number;
  /** Uncontrolled usage: the step number active on first render. @default 1 */
  defaultCurrentStep?: number;
  /** Fires with the requested step number whenever Back or Next is activated. */
  onStepChanged?: (step: number) => void;
  /** Called when Cancel is activated. */
  onCancel: () => void;
  /** Rendered in place of Next on the last step. Must contain at least one action. */
  completionActions: WizardCompletionAction[];
  /** @default 'Cancel' */
  cancelLabel?: string;
  /** @default 'Next' */
  nextLabel?: string;
  /** @default 'Back' */
  backLabel?: string;
}>;
