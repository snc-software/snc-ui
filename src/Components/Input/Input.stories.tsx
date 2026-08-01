import Input from './Input';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'number', 'search', 'email', 'password'],
    },
    onChange: { action: 'changed' },
  },
  args: {
    placeholder: 'Start typing',
    'aria-label': 'Example input',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'Hello world' },
};

export const HasError: Story = {
  args: { hasError: true, defaultValue: 'Invalid value' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit' },
};

export const Search: Story = {
  args: { type: 'search', placeholder: 'Search records' },
};

export const WithLabel: Story = {
  args: { label: 'Full name', 'aria-label': undefined },
};
