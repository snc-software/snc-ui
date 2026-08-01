import { useState } from 'react';

import SearchInput from './SearchInput';

import type { SearchInputOption, SearchInputProps } from './SearchInput.types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const people: SearchInputOption[] = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'alan', label: 'Alan Turing' },
];

const peopleWithDisabled: SearchInputOption[] = [
  ...people,
  { value: 'grace-2', label: 'Grace Hopper (archived)', disabled: true },
];

const manyPeople: SearchInputOption[] = Array.from({ length: 15 }, (_, index) => ({
  value: `person-${index + 1}`,
  label: `Person ${index + 1}`,
}));

/**
 * Wires `SearchInput` up the way a real consumer would: `onSearch` drives an external lookup (here,
 * a `setTimeout`-delayed filter over `dataset`, standing in for a network call), with `isLoading`
 * and `options` fed back in as the result arrives. `SearchInput` itself knows nothing about any of
 * this — it only calls `onSearch` and renders whatever `options`/`isLoading` it's given, and only
 * opens its listbox once a search actually completes — so every state below (loading, results, no
 * results) has to be reached by typing into the story, not by a pinned arg.
 */
function SearchInputDemo({
  dataset = people,
  ...args
}: Partial<SearchInputProps> & { dataset?: SearchInputOption[] }) {
  const [options, setOptions] = useState<SearchInputOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setOptions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setOptions(
        dataset.filter((person) => person.label.toLowerCase().includes(query.toLowerCase())),
      );
      setIsLoading(false);
    }, 600);
  };

  return (
    <SearchInput
      aria-label="Search people"
      {...args}
      options={options}
      isLoading={isLoading}
      onSearch={handleSearch}
    />
  );
}

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    visibleOptions: { control: { type: 'number', min: 1 } },
    debounceMs: { control: { type: 'number', min: 0 } },
    onChange: { action: 'changed' },
    onSearch: { action: 'searched' },
  },
  args: {
    options: people,
    onSearch: () => {},
    'aria-label': 'Search people',
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A text input that hands off all data-fetching to the consumer: typing debounces',
          '(`debounceMs`, default 300ms) then calls `onSearch(query)`, and the consumer feeds the',
          'results back in via `options`, plus `isLoading` while their fetch is in flight. There is',
          'no local filtering — the listbox always renders exactly what `options` currently holds.',
          '',
          'The listbox is never opened by focus or click, only by a completed search: while',
          '`isLoading` is `true` the only feedback is the spinner swapped in for the prefix icon, and',
          'the panel itself stays closed until results (or a "no results" row) are ready to show.',
          '',
          '```tsx',
          '<SearchInput',
          '  aria-label="Search people"',
          '  options={options}',
          '  isLoading={isLoading}',
          '  onSearch={(query) => fetchPeople(query).then(setOptions)}',
          '  onChange={(value) => setSelectedId(value)}',
          '/>',
          '```',
          '',
          'The **Default** story below is fully interactive — type a name (e.g. "ada" or "grace") to',
          'see the debounce, loading, and results states for real.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <SearchInputDemo {...args} />,
};

export const Small: Story = {
  render: (args) => <SearchInputDemo {...args} size="sm" />,
};

export const WithSelection: Story = {
  render: (args) => <SearchInputDemo {...args} defaultValue="ada" />,
};

export const WithPlaceholder: Story = {
  render: (args) => <SearchInputDemo {...args} placeholder="Search by name" />,
};

export const HasError: Story = {
  render: (args) => <SearchInputDemo {...args} hasError />,
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'ada' },
};

/**
 * The prefix icon swaps for a spinner, and `aria-busy` is set, whenever the consumer reports a
 * search is in flight — the panel itself stays closed for the whole duration.
 */
export const Loading: Story = {
  args: { options: [], isLoading: true },
};

/**
 * Type any name (e.g. "grace") to complete a search and reveal a disabled option — it's skipped by
 * keyboard navigation and can't be clicked.
 */
export const WithDisabledOption: Story = {
  render: (args) => <SearchInputDemo {...args} dataset={peopleWithDisabled} />,
};

/**
 * Type any text to complete a search against a 15-item dataset — the panel caps its height at
 * `visibleOptions` rows and scrolls beyond that.
 */
export const Scrolling: Story = {
  render: (args) => <SearchInputDemo {...args} dataset={manyPeople} visibleOptions={5} />,
};

/**
 * Every search "completes" with zero matches, so any typed text shows the custom `noResultsMessage`
 * row.
 */
export const CustomNoResultsMessage: Story = {
  render: (args) => (
    <SearchInputDemo {...args} dataset={[]} noResultsMessage="No people match that search" />
  ),
};

export const WithLabel: Story = {
  render: (args) => <SearchInputDemo {...args} label="Search people" aria-label={undefined} />,
};
