import Select from './Select';

import type { Meta, StoryObj } from '@storybook/react-vite';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: {
    options,
    'aria-label': 'Status',
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Choose a status', defaultValue: '' },
};

export const HasError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithDisabledOption: Story = {
  args: {
    options: [...options, { value: 'deleted', label: 'Deleted', disabled: true }],
  },
};
