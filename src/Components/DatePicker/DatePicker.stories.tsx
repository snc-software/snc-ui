import DatePicker from './DatePicker';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    includeTime: { control: 'boolean' },
    minYear: { control: { type: 'number' } },
    maxYear: { control: { type: 'number' } },
    onChange: { action: 'changed' },
  },
  args: {
    'aria-label': 'Date',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: '2026-07-31' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Choose a date' },
};

/**
 * `onChange` emits a UTC-midnight ISO 8601 datetime (e.g. `2026-07-31T00:00:00.000Z`) instead of a
 * plain `yyyy-MM-dd` string.
 */
export const IncludeTime: Story = {
  args: { includeTime: true, defaultValue: '2026-07-31' },
};

export const HasError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '2026-07-31' },
};

/**
 * The calendar's year selector is bounded to a custom range instead of the current year - 20 / + 10
 * default.
 */
export const CustomYearRange: Story = {
  args: { minYear: 2020, maxYear: 2030 },
};
