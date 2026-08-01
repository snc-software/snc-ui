import Autocomplete from './Autocomplete';

import type { Meta, StoryObj } from '@storybook/react-vite';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const manyOptions = Array.from({ length: 15 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}));

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    visibleOptions: { control: { type: 'number', min: 1 } },
    onChange: { action: 'changed' },
  },
  args: {
    options,
    'aria-label': 'Status',
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const WithSelection: Story = {
  args: { defaultValue: 'active' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Search status' },
};

export const HasError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'draft' },
};

export const WithDisabledOption: Story = {
  args: {
    options: [...options, { value: 'deleted', label: 'Deleted', disabled: true }],
  },
};

/**
 * The panel caps its height at `visibleOptions` rows and scrolls beyond that.
 */
export const Scrolling: Story = {
  args: { options: manyOptions, visibleOptions: 5 },
};

/**
 * Shown as a non-interactive row inside the listbox when the typed text matches nothing —
 * customizable via `noResultsMessage`.
 */
export const CustomNoResultsMessage: Story = {
  args: { noResultsMessage: 'Nothing matches your search' },
};

export const WithLabel: Story = {
  args: { label: 'Status', 'aria-label': undefined },
};
