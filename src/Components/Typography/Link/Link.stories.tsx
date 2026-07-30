import Link from './Link';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Typography/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    target: {
      control: 'select',
      options: [undefined, '_blank', '_self', '_parent', '_top'],
    },
  },
  args: {
    href: '#',
    children: 'Link',
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: {
    href: 'https://example.com',
    target: '_blank',
    children: 'External link',
  },
};
