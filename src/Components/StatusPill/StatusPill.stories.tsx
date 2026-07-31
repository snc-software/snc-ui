import StatusPill from './StatusPill';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Status Pill',
  component: StatusPill,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'warning', 'error', 'success'],
    },
    children: { control: 'text' },
  },
  args: {
    variant: 'info',
    children: 'Status',
  },
} satisfies Meta<typeof StatusPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: 'info', children: 'Draft' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Archived' },
};

export const Error: Story = {
  args: { variant: 'error', children: 'Failed' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
};
