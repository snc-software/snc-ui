import { useCallback, useMemo, useState } from 'react';

import StatusPill from '@/Components/StatusPill';

import Table from './Table';

import type { TableColumn, TableFetchParameters } from './Table.types';
import type { StatusPillProps } from '@/Components/StatusPill';
import type { Meta, StoryObj } from '@storybook/react-vite';

type DocumentRecord = {
  reference: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
  updated: string;
  isLocked?: boolean;
};

/**
 * Demonstrates the `cell` render prop: any React node can be returned, so a status column can render
 * the real `StatusPill` component rather than plain text.
 */
const StatusVariant: Record<DocumentRecord['status'], StatusPillProps['variant']> = {
  active: 'success',
  draft: 'info',
  archived: 'warning',
};

const owners = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson'];
const statuses: Array<DocumentRecord['status']> = ['active', 'draft', 'archived'];

const allRecords: DocumentRecord[] = Array.from({ length: 87 }, (_, index) => ({
  reference: `DOC-${String(index + 1).padStart(4, '0')}`,
  name: `Quarterly report ${index + 1}`,
  status: statuses[index % statuses.length],
  owner: owners[index % owners.length],
  updated: new Date(2026, 0, (index % 28) + 1).toISOString().slice(0, 10),
  isLocked: index % 7 === 0,
}));

const columns: Array<TableColumn<DocumentRecord>> = [
  {
    id: 'reference',
    title: 'Reference',
    accessor: (row) => row.reference,
    isSortable: true,
    filterType: 'input',
  },
  {
    id: 'name',
    title: 'Name',
    accessor: (row) => row.name,
    isSortable: true,
    filterType: 'input',
  },
  {
    id: 'status',
    title: 'Status',
    accessor: (row) => row.status,
    cell: (value) => {
      const status = value as DocumentRecord['status'];

      return <StatusPill variant={StatusVariant[status]}>{status}</StatusPill>;
    },
    filterType: 'dropdown',
    options: statuses.map((status) => ({ value: status, label: status })),
  },
  {
    id: 'owner',
    title: 'Owner',
    accessor: (row) => row.owner,
    isSortable: true,
    filterType: 'dropdown',
    options: owners.map((owner) => ({ value: owner, label: owner })),
  },
  {
    id: 'updated',
    title: 'Last updated',
    accessor: (row) => row.updated,
    isSortable: true,
  },
];

/**
 * Stands in for a server: filters, sorts and pages the fixture data using the same parameters the
 * consumer's own data source would receive.
 */
function queryRecords({ filters, page, pageSize, sortBy, sortDirection }: TableFetchParameters) {
  const filtered = allRecords.filter((record) =>
    filters.every((filter) => {
      const value = String(record[filter.id as keyof DocumentRecord] ?? '').toLowerCase();

      return value.includes(String(filter.value ?? '').toLowerCase());
    }),
  );

  const sorted = sortBy
    ? [...filtered].sort((left, right) => {
        const leftValue = String(left[sortBy as keyof DocumentRecord] ?? '');
        const rightValue = String(right[sortBy as keyof DocumentRecord] ?? '');
        const comparison = leftValue.localeCompare(rightValue);

        return sortDirection === 'desc' ? -comparison : comparison;
      })
    : filtered;

  const start = (page - 1) * pageSize;

  return { rows: sorted.slice(start, start + pageSize), total: sorted.length };
}

function TableDemo(args: Partial<Parameters<typeof Table<DocumentRecord>>[0]>) {
  const [rows, setRows] = useState<DocumentRecord[]>([]);
  const [total, setTotal] = useState(0);

  const handleFetchRequested = useCallback((parameters: TableFetchParameters) => {
    const result = queryRecords(parameters);

    setRows(result.rows);
    setTotal(result.total);
  }, []);

  // Returned unconditionally: a non-empty result is what enables the selection column, so gating it on
  // `selected.length` would mean the checkboxes never appear in the first place.
  const getSelectionActions = useMemo(() => () => [{ id: 'archive', label: 'Archive' }], []);

  return (
    <Table<DocumentRecord>
      columns={columns}
      {...args}
      data={rows}
      total={total}
      onFetchRequested={handleFetchRequested}
      getSelectionActions={args.getSelectionActions ?? getSelectionActions}
    />
  );
}

// Instantiation expression: `Table` is generic, so binding it to a concrete row type here gives
// Storybook's `Meta`/`StoryObj` inference something better than `object` to work with.
const TypedTable = Table<DocumentRecord>;

const meta = {
  title: 'Components/Table',
  component: TypedTable,
  tags: ['autodocs'],
  args: {
    columns,
    data: [],
    total: 0,
    onFetchRequested: () => {},
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A data table with configurable columns, per-column sorting and filtering, custom cell',
          'rendering, row selection, pagination and a toolbar.',
          '',
          'The Table is fully controlled: it never fetches. Every interaction calls `onFetchRequested`',
          'with the current filters, page, page size and sort, and the consumer supplies `data` and',
          '`total` in response.',
          '',
          '```tsx',
          'const columns: Array<TableColumn<Row>> = [',
          '  { id: "name", title: "Name", accessor: (row) => row.name, isSortable: true,',
          '    filterType: "input" },',
          '  { id: "status", title: "Status", accessor: (row) => row.status,',
          '    cell: (value) => <StatusPill variant={statusVariant[value]}>{value}</StatusPill>,',
          '    filterType: "dropdown", options: statusOptions },',
          '];',
          '',
          '<Table',
          '  columns={columns}',
          '  data={rows}',
          '  total={total}',
          '  onFetchRequested={({ filters, page, pageSize, sortBy, sortDirection }) => fetchRows(...)}',
          '/>',
          '```',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof TypedTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TableDemo />,
};

export const WithRowSelection: Story = {
  render: () => (
    <TableDemo
      getSelectionActions={() => [
        { id: 'archive', label: 'Archive' },
        { id: 'export', label: 'Export' },
      ]}
      isRowSelectable={(row) => !row.isLocked}
    />
  ),
};

export const WithToolbarActions: Story = {
  render: () => (
    <TableDemo
      actions={[
        { id: 'create', label: 'New document' },
        { id: 'export', label: 'Export all' },
      ]}
    />
  ),
};

export const WithPreAppliedFilter: Story = {
  render: () => (
    <TableDemo filters={[{ id: 'status', title: 'Status', text: 'active', value: 'active' }]} />
  ),
};

export const WithClickableRows: Story = {
  render: () => <TableDemo onRowClicked={() => {}} />,
};

export const NotPaginated: Story = {
  render: () => <TableDemo isPaginated={false} />,
};

export const Loading: Story = {
  render: () => (
    <Table<DocumentRecord>
      columns={columns}
      data={[]}
      total={0}
      isLoading
      onFetchRequested={() => {}}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <Table<DocumentRecord> columns={columns} data={[]} total={0} onFetchRequested={() => {}} />
  ),
};

export const EmptyWithCustomMessage: Story = {
  render: () => (
    <Table<DocumentRecord>
      columns={columns}
      data={[]}
      total={0}
      emptyMessage="No documents match those filters"
      onFetchRequested={() => {}}
    />
  ),
};
