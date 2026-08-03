import OptionsList from './OptionsList';

import type { OptionItem, OptionsCollection, OptionsGroup } from './OptionsList.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const fruits: OptionItem[] = [
  { id: 'apple', title: 'Apple' },
  { id: 'banana', title: 'Banana' },
  { id: 'cherry', title: 'Cherry' },
];

const groupedTree: OptionsGroup = {
  title: 'Fruits',
  childOptions: fruits,
};

const collectionOptions: OptionsCollection = {
  Fruits: fruits,
  Vegetables: [
    { id: 'carrot', title: 'Carrot' },
    { id: 'potato', title: 'Potato' },
  ],
};

const linkItems: OptionItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of your account',
    href: '#dashboard',
  },
  { id: 'billing', title: 'Billing', description: 'Manage your subscription', href: '#billing' },
  { id: 'settings', title: 'Settings', description: 'Update your preferences', href: '#settings' },
];

const meta = {
  title: 'Components/OptionsList',
  component: OptionsList,
  tags: ['autodocs'],
  argTypes: {
    checkbox: { control: 'boolean' },
    defaultNestedExpanded: { control: 'boolean' },
    selectAll: { control: 'boolean' },
    selectedOnly: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: {
    options: fruits,
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A recursive, polymorphic options engine: pass a flat array, a single item, a collapsible',
          '`OptionsGroup`, or a `Tag`-headed `OptionsCollection`, and it dispatches to the matching',
          'rendering at every level, arbitrarily nested, and is intended for any checkbox multi-select',
          'or link-list use case.',
          '',
          'Selection is a hybrid: it holds its own internal state seeded from `selected`, so clicking',
          'checkboxes below works without any story-level wiring, while `onChange` still fires with the',
          'full updated array of ids for a real consumer to persist.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof OptionsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * A collapsible `OptionsGroup` — expanded here via `defaultNestedExpanded` so its children are
 * visible without an extra click.
 */
export const Grouped: Story = {
  args: { options: groupedTree, defaultNestedExpanded: true },
};

/**
 * An `OptionsCollection`: one `Tag` heading per object key, each with its own nested options.
 */
export const Collection: Story = {
  args: { options: collectionOptions },
};

/**
 * A group's "select all" checkbox shows an indeterminate state while only some of its children are
 * selected, and toggles every child at once.
 */
export const SelectAllIndeterminate: Story = {
  args: {
    options: groupedTree,
    defaultNestedExpanded: true,
    selectAll: true,
    selected: ['apple'],
  },
};

/**
 * Only currently-selected options are rendered — unchecking an item removes it from view
 * immediately.
 */
export const SelectedOnly: Story = {
  args: { options: fruits, selected: ['banana'], selectedOnly: true },
};

/**
 * Link-list pattern: `checkbox={false}` renders each row as a link (when it has `href`) instead of a
 * checkbox row.
 */
export const LinkList: Story = {
  args: { options: linkItems, checkbox: false },
};
