import Accordion from './Accordion';

import type { Meta, StoryObj } from '@storybook/react-vite';

const items = [
  {
    id: 'billing',
    header: 'Billing',
    content: 'Update your billing address, payment method, and invoice preferences.',
  },
  {
    id: 'shipping',
    header: 'Shipping',
    content: 'Manage the addresses used for order fulfillment.',
  },
  {
    id: 'notifications',
    header: 'Notifications',
    content: 'Choose which emails and alerts you want to receive.',
  },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    onOpenItemsChanged: { action: 'openItemsChanged' },
  },
  args: {
    items,
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleOpenByDefault: Story = {
  args: { defaultOpenItems: ['billing', 'notifications'] },
};

export const Controlled: Story = {
  args: { openItems: ['shipping'] },
};
