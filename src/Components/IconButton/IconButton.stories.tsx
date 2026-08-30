import { Heart, Settings, Trash } from 'iconoir-react';

import IconButton from './IconButton';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Like',
    children: <Heart />,
  },
};

export const WithDifferentIcon: Story = {
  args: {
    label: 'Settings',
    children: <Settings />,
  },
};

export const Destructive: Story = {
  args: {
    label: 'Delete',
    children: <Trash />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Like',
    children: <Heart />,
    disabled: true,
  },
};
