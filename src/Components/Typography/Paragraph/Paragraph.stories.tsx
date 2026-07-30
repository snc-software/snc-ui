import Paragraph from './Paragraph';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Typography/Paragraph',
  component: Paragraph,
  tags: ['autodocs'],
  args: {
    children:
      'This is a paragraph of body copy demonstrating the default typography styling used across the snc-ui component library.',
  },
} satisfies Meta<typeof Paragraph>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
