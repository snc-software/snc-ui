import { useEffect, useState } from 'react';

import CmdK from './CmdK';

import type { CmdKProps } from './CmdK.types';
import type { Options } from '@/Components/OptionsList';
import type { Meta, StoryObj } from '@storybook/react-vite';

type NavItem = { id: string; title: string; description?: string; href?: string };

const pages: NavItem[] = [
  { id: 'dashboard', title: 'Dashboard', description: 'Overview of your account', href: '#dashboard' },
  { id: 'billing', title: 'Billing', description: 'Manage your subscription', href: '#billing' },
  { id: 'settings', title: 'Settings', description: 'Update your preferences', href: '#settings' },
  { id: 'team', title: 'Team members', description: 'Invite and manage teammates', href: '#team' },
];

/**
 * Wires `CmdK` up the way a real consumer would: `onSearch` drives an external lookup (here, a
 * `setTimeout`-delayed filter over `dataset`, standing in for a network call), with `isLoading` and
 * `options` fed back in as the result arrives. A global `Cmd+K`/`Ctrl+K` listener opens the palette
 * from anywhere, matching shadcn's own `CommandDialog` docs pattern — `CmdK` itself has no built-in
 * shortcut, so wiring one up is always the consumer's responsibility.
 */
function CmdKDemo({
  dataset = pages,
  initialOptions = dataset,
  isOpen: initialOpen = false,
  ...args
}: Partial<CmdKProps> & { dataset?: NavItem[]; initialOptions?: Options }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [options, setOptions] = useState<Options>(initialOptions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setOptions(initialOptions);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setOptions(
        dataset.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
      );
      setIsLoading(false);
    }, 400);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open command palette (⌘K)
      </button>
      <CmdK
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        options={options}
        isLoading={isLoading}
        onSearch={handleSearch}
      />
    </>
  );
}

const meta = {
  title: 'Components/CmdK',
  component: CmdK,
  tags: ['autodocs'],
  argTypes: {
    debounceMs: { control: { type: 'number', min: 0 } },
    isLoading: { control: 'boolean' },
    onSearch: { action: 'searched' },
  },
  args: {
    isOpen: false,
    onClose: () => {},
    options: pages,
    onSearch: () => {},
  },
  parameters: {
    docs: {
      // Each story below opens a real, portalled `Modal` and attaches its own global `Cmd+K`/
      // `Ctrl+K` listener. Autodocs' default "inline" rendering mounts every story of a component
      // into one shared document, so those listeners and portals collide — pressing the shortcut
      // once would open every story's palette simultaneously and block Storybook's own UI.
      // Isolating each story into its own iframe (matching Canvas) removes that shared document.
      story: { inline: false, iframeHeight: 500 },
      description: {
        component: [
          'A search-driven command palette rendered inside `Modal`, modelled on shadcn\'s',
          '`Command`/`CommandDialog`. Filtering is entirely external — typing debounces',
          '(`debounceMs`, default 300ms) then calls `onSearch(query)`, and the consumer feeds results',
          'back in via `options` (plus `isLoading` while their fetch is in flight), the same',
          'convention `SearchInput` uses.',
          '',
          'Items are rendered via the same recursive, groupable options engine used across this',
          'library — pass a flat array, nested groups, or a keyed collection. An item with `href`',
          'renders as a real link; one with `onClick` renders as a button and runs the callback when',
          'activated (click or `Enter`), after which the palette closes.',
          '',
          '```tsx',
          '<CmdK',
          '  isOpen={isOpen}',
          '  onClose={() => setIsOpen(false)}',
          '  options={options}',
          '  onSearch={(query) => searchPages(query).then(setOptions)}',
          '/>',
          '```',
          '',
          'The **Default** story is fully interactive — press **⌘K**/**Ctrl+K** or click the button',
          'to open it, then type to filter.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof CmdK>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <CmdKDemo {...args} />,
};

/**
 * Options grouped under headings, each rendered with a `Tag` — press ⌘K/Ctrl+K or click the button,
 * then type to filter within and across groups.
 */
export const Grouped: Story = {
  render: (args) => (
    <CmdKDemo
      {...args}
      dataset={pages}
      initialOptions={{
        Navigate: pages.slice(0, 2),
        Manage: pages.slice(2),
      }}
    />
  ),
};

/**
 * Opens with no options at all — the real async-search UX, not a pre-populated list. All three of a
 * search's states are reachable here through interaction, rather than as separate stories: nothing is
 * shown until you type; typing a matching name (e.g. "team") shows the loading spinner while the
 * (simulated) request is in flight, then the matching results; typing something that matches nothing
 * (e.g. "zzz") shows the empty-results message instead.
 */
export const LiveSearch: Story = {
  render: (args) => <CmdKDemo {...args} isOpen initialOptions={[]} />,
};
