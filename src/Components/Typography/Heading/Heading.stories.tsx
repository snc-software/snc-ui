import Heading from './Heading';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
  args: {
    children: 'Heading',
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const H1: Story = {
  args: {
    level: 'h1',
  },
};

export const H2: Story = {
  args: {
    level: 'h2',
  },
};

export const H3: Story = {
  args: {
    level: 'h3',
  },
};

export const H4: Story = {
  args: {
    level: 'h4',
  },
};

export const H5: Story = {
  args: {
    level: 'h5',
  },
};

export const H6: Story = {
  args: {
    level: 'h6',
  },
};
