import { FloppyDisk } from 'iconoir-react';

import Button from './Button';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'round', 'text'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Round: Story = {
  args: {
    variant: 'round',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: <FloppyDisk />,
    iconPosition: 'trailing',
  },
};
