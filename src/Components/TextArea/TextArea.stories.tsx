import TextArea from './TextArea';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    onChange: { action: 'changed' },
  },
  args: {
    placeholder: 'Start typing',
    'aria-label': 'Example text area',
  },
} satisfies Meta<typeof TextArea>;

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
