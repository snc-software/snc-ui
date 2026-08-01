import { useState } from 'react';

import Wizard from './Wizard';

import type { WizardStep } from './Wizard.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const steps: WizardStep[] = [
  { content: 'Tell us about your company.' },
  { content: 'Choose the plan that fits your team.' },
  { content: 'Review your details before finishing.' },
];

const meta = {
  title: 'Components/Wizard',
  component: Wizard,
  tags: ['autodocs'],
  argTypes: {
    onCancel: { action: 'cancel' },
    onStepChanged: { action: 'stepChanged' },
  },
  args: {
    steps,
    onCancel: () => {},
    completionActions: [{ key: 'finish', label: 'Finish', onClick: () => {} }],
  },
} satisfies Meta<typeof Wizard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: (args) => {
    function ControlledWizard() {
      const [currentStep, setCurrentStep] = useState(1);

      return <Wizard {...args} currentStep={currentStep} onStepChanged={setCurrentStep} />;
    }

    return <ControlledWizard />;
  },
};

export const ValidationGating: Story = {
  args: {
    steps: [
      { content: 'This step blocks Next until you agree.', canProceed: () => false },
      { content: 'Second step content.' },
    ],
  },
};

export const SingleStep: Story = {
  args: {
    steps: [{ content: 'A single-step flow is both the first and last step.' }],
  },
};
