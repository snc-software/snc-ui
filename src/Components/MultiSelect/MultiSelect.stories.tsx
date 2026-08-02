import MultiSelect from './MultiSelect';

import type { OptionItem, OptionsCollection, OptionsGroup } from '@/Components/OptionsList';
import type { Meta, StoryObj } from '@storybook/react-vite';

const options: OptionItem[] = [
  { id: 'draft', title: 'Draft' },
  { id: 'active', title: 'Active' },
  { id: 'archived', title: 'Archived' },
];

const manyOptions: OptionItem[] = Array.from({ length: 15 }, (_, index) => ({
  id: `option-${index + 1}`,
  title: `Option ${index + 1}`,
}));

const groupedOptions: OptionsGroup = {
  title: 'Statuses',
  childOptions: options,
};

const collectionOptions: OptionsCollection = {
  Open: [options[0], options[1]],
  Closed: [options[2]],
};

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
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
  parameters: {
    docs: {
      description: {
        component: [
          'Options accept the same recursive shape as `OptionsList`/`CmdK`: a flat array, a',
          'collapsible `OptionsGroup`, or a `Tag`-headed `OptionsCollection`, arbitrarily nested — see',
          'the **Grouped** and **Collection** stories.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const WithSelection: Story = {
  args: { defaultValue: ['active', 'archived'] },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Choose statuses' },
};

export const HasError: Story = {
  args: { hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['draft'] },
};

export const WithDisabledOption: Story = {
  args: {
    options: [...options, { id: 'deleted', title: 'Deleted', disabled: true }],
  },
};

export const WithLabel: Story = {
  args: { label: 'Status', 'aria-label': undefined },
};

/**
 * The panel caps its height at `visibleOptions` rows and scrolls beyond that.
 */
export const Scrolling: Story = {
  args: { options: manyOptions, visibleOptions: 5 },
};

/**
 * A collapsible `OptionsGroup` — click the group heading to reveal its checkboxes.
 */
export const Grouped: Story = {
  args: { options: groupedOptions },
};

/**
 * An `OptionsCollection`: one `Tag` heading per object key, each with its own nested checkboxes.
 */
export const Collection: Story = {
  args: { options: collectionOptions },
};
