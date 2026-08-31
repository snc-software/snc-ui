import Skeleton from './Skeleton';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
  },
  args: {
    shape: 'text',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { shape: 'text' },
};

export const Circle: Story = {
  args: { shape: 'circle' },
};

export const Rect: Story = {
  args: { shape: 'rect' },
};

export const TextLines: Story = {
  render: () => (
    <div className="snc:flex snc:w-64 snc:flex-col snc:gap-2">
      <Skeleton shape="text" />
      <Skeleton shape="text" />
      <Skeleton shape="text" className="snc:w-1/2" />
    </div>
  ),
};
