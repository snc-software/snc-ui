import { useCallback, useState } from 'react';

import StatusPill from '@/Components/StatusPill';
import { Heading, Paragraph } from '@/Components/Typography';

import MasterDetailsTable from './MasterDetailsTable';

import type { TableColumn, TableFetchParameters } from '@/Components/Table';
import type { Meta, StoryObj } from '@storybook/react-vite';

type Message = {
  subject: string;
  from: string;
  received: string;
  status: 'unread' | 'read';
  body: string;
};

const senders = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson'];

const allMessages: Message[] = Array.from({ length: 42 }, (_, index) => ({
  subject: `Release notes for build ${index + 1}`,
  from: senders[index % senders.length],
  received: new Date(2026, 0, (index % 28) + 1).toISOString().slice(0, 10),
  status: index % 3 === 0 ? 'unread' : 'read',
  body: [
    `Build ${index + 1} is on the release candidate branch and ready for review.`,
    'The migration ran clean against the staging snapshot, and the two flaky integration tests',
    'from last week are green again after the retry policy change.',
    '',
    'Nothing here needs a decision before Friday — flagging it early so there are no surprises.',
  ].join(' '),
}));

const columns: Array<TableColumn<Message>> = [
  {
    id: 'subject',
    title: 'Subject',
    accessor: (row) => row.subject,
    isSortable: true,
    filterType: 'input',
  },
  {
    id: 'from',
    title: 'From',
    accessor: (row) => row.from,
    isSortable: true,
    filterType: 'dropdown',
    options: senders.map((sender) => ({ value: sender, label: sender })),
  },
  {
    id: 'status',
    title: 'Status',
    accessor: (row) => row.status,
    cell: (value) => (
      <StatusPill variant={value === 'unread' ? 'info' : 'success'}>{String(value)}</StatusPill>
    ),
  },
  { id: 'received', title: 'Received', accessor: (row) => row.received, isSortable: true },
];

/**
 * Stands in for a server, using the same parameters the consumer's own data source would receive.
 */
function queryMessages({ filters, page, pageSize, sortBy, sortDirection }: TableFetchParameters) {
  const filtered = allMessages.filter((message) =>
    filters.every((filter) => {
      const value = String(message[filter.id as keyof Message] ?? '').toLowerCase();

      return value.includes(String(filter.value ?? '').toLowerCase());
    }),
  );

  const sorted = sortBy
    ? [...filtered].sort((left, right) => {
        const comparison = String(left[sortBy as keyof Message] ?? '').localeCompare(
          String(right[sortBy as keyof Message] ?? ''),
        );

        return sortDirection === 'desc' ? -comparison : comparison;
      })
    : filtered;

  const start = (page - 1) * pageSize;

  return { rows: sorted.slice(start, start + pageSize), total: sorted.length };
}

function MasterDetailsTableDemo(args: Partial<Parameters<typeof MasterDetailsTable<Message>>[0]>) {
  const [rows, setRows] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);

  const handleFetchRequested = useCallback((parameters: TableFetchParameters) => {
    const result = queryMessages(parameters);

    setRows(result.rows);
    setTotal(result.total);
  }, []);

  return (
    // Both panes scroll independently, which needs a bounded height — the consumer owns it, so the
    // story supplies one here rather than the component imposing its own.
    <div className="snc:h-[32rem]">
      <MasterDetailsTable<Message>
        columns={columns}
        masterColumnId="subject"
        detailTitle={(row) => row.subject}
        detail={(row) => (
          <>
            <Heading level="h4">{row.subject}</Heading>
            <Paragraph>
              {row.from} — {row.received}
            </Paragraph>
            <Paragraph>{row.body}</Paragraph>
          </>
        )}
        {...args}
        data={rows}
        total={total}
        onFetchRequested={handleFetchRequested}
      />
    </div>
  );
}

// Instantiation expression: `MasterDetailsTable` is generic, so binding it to a concrete row type
// gives Storybook's `Meta`/`StoryObj` inference something better than `object` to work with.
const TypedMasterDetailsTable = MasterDetailsTable<Message>;

const meta = {
  title: 'Components/MasterDetailsTable',
  component: TypedMasterDetailsTable,
  tags: ['autodocs'],
  args: {
    columns,
    data: [],
    total: 0,
    onFetchRequested: () => {},
    detail: () => null,
  },
  parameters: {
    docs: {
      description: {
        component: [
          'An Apple Mail-style two-pane table. With nothing open it is a full-width table; clicking a',
          'row collapses the list to a single column, narrows it to a master pane, and opens the',
          "row's contents in an independently scrollable detail pane beside it.",
          '',
          'A sibling of `Table` rather than a wrapper around it: both are layouts over the same',
          'internal parts and the same table controller, so sorting, filtering, pagination, selection',
          'and the header/cell treatment are shared code rather than lookalikes. Every prop describing',
          'the data behaves exactly as it does on `Table`; there is no `onRowClicked`, because a row',
          'click is what opens the detail pane.',
          '',
          'The toolbar and filter chips span the full width above both panes.',
          '',
          'Both panes scrolling independently requires a bounded height, which the component takes',
          'from its container rather than imposing — give the parent a height.',
          '',
          '```tsx',
          '<div className="h-screen">',
          '  <MasterDetailsTable',
          '    columns={columns}',
          '    data={rows}',
          '    total={total}',
          '    masterColumnId="subject"',
          '    detailTitle={(row) => row.subject}',
          '    detail={(row) => <MessageBody message={row} />}',
          '    onFetchRequested={({ filters, page, pageSize }) => fetchMessages(...)}',
          '  />',
          '</div>',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof TypedMasterDetailsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <MasterDetailsTableDemo />,
};

export const OpenOnFirstRender: Story = {
  render: () => <MasterDetailsTableDemo defaultSelectedRow={allMessages[0]} />,
};

export const WithoutPagination: Story = {
  render: () => <MasterDetailsTableDemo isPaginated={false} />,
};

export const WithRowSelection: Story = {
  render: () => (
    <MasterDetailsTableDemo getSelectionActions={() => [{ id: 'archive', label: 'Archive' }]} />
  ),
};

export const WithCustomCloseLabel: Story = {
  render: () => <MasterDetailsTableDemo closeLabel="Close message" />,
};
