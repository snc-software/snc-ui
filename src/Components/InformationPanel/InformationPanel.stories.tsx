import { useEffect, useState } from 'react';

import InformationPanel from './InformationPanel';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Information Panel',
  component: InformationPanel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'warning', 'error', 'success'],
    },
    heading: { control: 'text' },
    subtext: { control: 'text' },
  },
  args: {
    variant: 'info',
    heading: 'Heads up',
    subtext: 'Here is some additional context about this notice.',
  },
} satisfies Meta<typeof InformationPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: 'info' },
};

export const Warning: Story = {
  args: { variant: 'warning' },
};

export const Error: Story = {
  args: { variant: 'error' },
};

export const Success: Story = {
  args: { variant: 'success' },
};

/**
 * Uncontrolled: the panel owns its own dismissal. Clicking the "X" removes it from the DOM
 * immediately; `onDismiss` only notifies the consumer, e.g. to clear a toast auto-dismiss timer.
 */
export const Dismissible: Story = {
  args: { variant: 'info', onDismiss: () => {} },
};

/**
 * Controlled: visibility is driven by the `open` prop, letting an external caller (e.g. a toast
 * manager on a timeout) dismiss the panel without any interaction with it at all. This story's
 * `setTimeout` stands in for that external caller — the panel closes on its own after 4 seconds
 * even if the "X" is never clicked. Clicking the "X" still calls `onDismiss`, which this story
 * also wires to the same `setOpen(false)`, so both paths converge on the one `open` prop.
 */
export const ControlledDismiss: Story = {
  render: (args) => {
    function ControlledToast() {
      const [open, setOpen] = useState(true);

      useEffect(() => {
        const timer = setTimeout(() => setOpen(false), 4000);

        return () => clearTimeout(timer);
      }, []);

      return <InformationPanel {...args} open={open} onDismiss={() => setOpen(false)} />;
    }

    return <ControlledToast />;
  },
  args: {
    variant: 'warning',
    heading: 'Auto-dismissing',
    subtext: 'Closes on its own after 4 seconds — try leaving it alone.',
  },
};
