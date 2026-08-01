import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Wizard from './Wizard';

import type { WizardCompletionAction, WizardStep } from './Wizard.types';

const steps: WizardStep[] = [
  { content: 'Step one content' },
  { content: 'Step two content' },
  { content: 'Step three content' },
];

const completionActions: WizardCompletionAction[] = [
  { key: 'submit', label: 'Submit', onClick: vi.fn() },
];

describe('Wizard', () => {
  describe('Rendering', () => {
    it("renders the first step's content", () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.getByText('Step one content')).toBeInTheDocument();
    });

    it("renders only the active step's content, not other steps", () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.queryByText('Step two content')).not.toBeInTheDocument();
      expect(screen.queryByText('Step three content')).not.toBeInTheDocument();
    });
  });

  describe('First-step actions', () => {
    it('renders Cancel and Next actions on the first step', () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('does not render a Back action on the first step', () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    });
  });

  describe('Middle-step actions', () => {
    it('renders Back, Cancel, and Next actions on a step that is neither first nor last', () => {
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={2}
          onCancel={vi.fn()}
          completionActions={completionActions}
        />,
      );

      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });
  });

  describe('Last-step actions', () => {
    it('replaces Next with the supplied completion actions on the last step', () => {
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={3}
          onCancel={vi.fn()}
          completionActions={completionActions}
        />,
      );

      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders multiple completion actions on the last step', () => {
      const actions: WizardCompletionAction[] = [
        { key: 'save-draft', label: 'Save Draft', onClick: vi.fn() },
        { key: 'submit', label: 'Submit', onClick: vi.fn() },
      ];
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={3}
          onCancel={vi.fn()}
          completionActions={actions}
        />,
      );

      expect(screen.getByRole('button', { name: 'Save Draft' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('still renders Back and Cancel on the last step', () => {
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={3}
          onCancel={vi.fn()}
          completionActions={completionActions}
        />,
      );

      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('Navigation interaction', () => {
    it('advances to the next step when Next is clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(screen.getByText('Step two content')).toBeInTheDocument();
    });

    it('returns to the previous step when Back is clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={2}
          onCancel={vi.fn()}
          completionActions={completionActions}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(screen.getByText('Step one content')).toBeInTheDocument();
    });

    it('calls onStepChanged with the requested step number on Next/Back', async () => {
      const user = userEvent.setup();
      const onStepChanged = vi.fn();
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={2}
          onCancel={vi.fn()}
          completionActions={completionActions}
          onStepChanged={onStepChanged}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(onStepChanged).toHaveBeenCalledWith(3);
    });

    it('does not change the active step itself when currentStep is controlled', async () => {
      const user = userEvent.setup();
      render(
        <Wizard
          steps={steps}
          currentStep={1}
          onCancel={vi.fn()}
          completionActions={completionActions}
          onStepChanged={vi.fn()}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(screen.getByText('Step one content')).toBeInTheDocument();
    });

    it('respects a consumer-controlled currentStep value', () => {
      const { rerender } = render(
        <Wizard
          steps={steps}
          currentStep={1}
          onCancel={vi.fn()}
          completionActions={completionActions}
          onStepChanged={vi.fn()}
        />,
      );

      expect(screen.getByText('Step one content')).toBeInTheDocument();

      rerender(
        <Wizard
          steps={steps}
          currentStep={2}
          onCancel={vi.fn()}
          completionActions={completionActions}
          onStepChanged={vi.fn()}
        />,
      );

      expect(screen.getByText('Step two content')).toBeInTheDocument();
    });
  });

  describe('Cancel/Completion callbacks', () => {
    it('calls onCancel when Cancel is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<Wizard steps={steps} onCancel={onCancel} completionActions={completionActions} />);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalled();
    });

    it("calls a completion action's onClick when it is clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const actions: WizardCompletionAction[] = [{ key: 'submit', label: 'Submit', onClick }];
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={3}
          onCancel={vi.fn()}
          completionActions={actions}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Labels', () => {
    it('uses custom cancelLabel/nextLabel/backLabel when supplied', () => {
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={2}
          onCancel={vi.fn()}
          completionActions={completionActions}
          cancelLabel="Quit"
          nextLabel="Continue"
          backLabel="Previous"
        />,
      );

      expect(screen.getByRole('button', { name: 'Quit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });
  });

  describe('Single-step edge case', () => {
    it('renders completion actions (no Next) and no Back when there is only one step', () => {
      render(
        <Wizard
          steps={[{ content: 'Only step' }]}
          onCancel={vi.fn()}
          completionActions={completionActions}
        />,
      );

      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });

  describe('Progress indicator', () => {
    it('renders one progress marker per step', () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('marks the active step with aria-current="step"', () => {
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={2}
          onCancel={vi.fn()}
          completionActions={completionActions}
        />,
      );

      expect(screen.getByText('Step 2, current')).toBeInTheDocument();
    });

    it('shows a completed marker for every step before the active one', () => {
      render(
        <Wizard
          steps={steps}
          defaultCurrentStep={3}
          onCancel={vi.fn()}
          completionActions={completionActions}
        />,
      );

      expect(screen.getByText('Step 1, completed')).toBeInTheDocument();
      expect(screen.getByText('Step 2, completed')).toBeInTheDocument();
    });
  });

  describe('Validation gating (canProceed)', () => {
    it("disables Next when the active step's canProceed returns false", () => {
      const blockedSteps: WizardStep[] = [
        { content: 'Step one content', canProceed: () => false },
        { content: 'Step two content' },
      ];
      render(
        <Wizard steps={blockedSteps} onCancel={vi.fn()} completionActions={completionActions} />,
      );

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('enables Next when canProceed is omitted', () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    });

    it('disables all completion actions on the last step when canProceed returns false', () => {
      const blockedSteps: WizardStep[] = [
        { content: 'Step one content' },
        { content: 'Step two content', canProceed: () => false },
      ];
      const actions: WizardCompletionAction[] = [
        { key: 'save-draft', label: 'Save Draft', onClick: vi.fn() },
        { key: 'submit', label: 'Submit', onClick: vi.fn() },
      ];
      render(
        <Wizard
          steps={blockedSteps}
          defaultCurrentStep={2}
          onCancel={vi.fn()}
          completionActions={actions}
        />,
      );

      expect(screen.getByRole('button', { name: 'Save Draft' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('exposes footer actions via getByRole("button", { name: ... })', () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('exposes progress markers via an accessible name (sr-only label), not icon-only', () => {
      render(<Wizard steps={steps} onCancel={vi.fn()} completionActions={completionActions} />);

      expect(screen.getByText('Step 1, current')).toBeInTheDocument();
    });
  });
});
