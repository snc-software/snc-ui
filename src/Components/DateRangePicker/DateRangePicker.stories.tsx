import DateRangePicker from './DateRangePicker';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
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
    'aria-label': 'Date range',
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: { start: '2026-07-01', end: '2026-07-15' } },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Choose a date range' },
};

/**
 * `onChange` emits UTC-midnight (`start`) and UTC-23:59:59 (`end`) ISO 8601 datetimes instead of
 * plain `yyyy-MM-dd` strings.
 */
export const IncludeTime: Story = {
  args: { includeTime: true, defaultValue: { start: '2026-07-01', end: '2026-07-15' } },
};

export const HasError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: { start: '2026-07-01', end: '2026-07-15' } },
};

/**
 * Both months' year selectors are bounded to a custom range instead of the current year - 20 / + 10
 * default.
 */
export const CustomYearRange: Story = {
  args: { minYear: 2020, maxYear: 2030 },
};

export const WithLabel: Story = {
  args: { label: 'Date range', 'aria-label': undefined },
};
