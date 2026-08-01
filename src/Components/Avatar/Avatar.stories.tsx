import Avatar from './Avatar';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Ada Lovelace',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const Image: Story = {
  args: { src: 'https://i.pravatar.cc/150?img=5' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};
