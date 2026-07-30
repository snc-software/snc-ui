import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Table from './Table';

import type { TableColumn } from './Table.types';

type Row = { name: string; status: string; isLocked?: boolean };

const columns: Array<TableColumn<Row>> = [
  { id: 'name', title: 'Name', accessor: (row) => row.name, isSortable: true },
  { id: 'status', title: 'Status', accessor: (row) => row.status, filterType: 'input' },
];

const rows: Row[] = [
  { name: 'Ada', status: 'active' },
  { name: 'Grace', status: 'archived', isLocked: true },
];

function renderTable(overrides: Partial<Parameters<typeof Table<Row>>[0]> = {}) {
  const props = {
    columns,
    data: rows,
    total: 40,
    onFetchRequested: vi.fn(),
    ...overrides,
  };

  const result = render(<Table<Row> {...props} />);

  return { ...props, ...result };
}

describe('Table', () => {
  it('renders a table with one header per configured column', () => {
    renderTable();

    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
  });

  it('renders one body row per data item', () => {
    renderTable();

    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Grace' })).toBeInTheDocument();
  });

  it('calls onFetchRequested once on mount with the default parameters', () => {
    const { onFetchRequested } = renderTable();

    expect(onFetchRequested).toHaveBeenCalledTimes(1);
    expect(onFetchRequested).toHaveBeenCalledWith({
      filters: [],
      page: 1,
      pageSize: 20,
      sortBy: undefined,
      sortDirection: undefined,
    });
  });

  it('honours a supplied initial page size', () => {
    const { onFetchRequested } = renderTable({ pageSize: 50 });

    expect(onFetchRequested).toHaveBeenCalledWith(expect.objectContaining({ pageSize: 50 }));
  });

  it('ignores an initial page size that is not among the options', () => {
    const { onFetchRequested } = renderTable({ pageSize: 33 });

    expect(onFetchRequested).toHaveBeenCalledWith(expect.objectContaining({ pageSize: 20 }));
  });

  it('requests a sorted fetch when a sortable header is sorted', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderTable();

    await user.click(screen.getByRole('button', { name: 'Sort by name' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortBy: 'name', sortDirection: 'asc' }),
    );
  });

  it('clears the sort after cycling past descending', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderTable();

    const sortButton = screen.getByRole('button', { name: 'Sort by name' });
    await user.click(sortButton);
    await user.click(sortButton);
    await user.click(sortButton);

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortBy: undefined, sortDirection: undefined }),
    );
  });

  it('requests the new page when a pagination control is used', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderTable();

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
  });

  it('resets to page 1 when the page size changes', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderTable();

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));
    await user.click(screen.getByRole('combobox', { name: 'Rows per page' }));
    await user.click(screen.getByRole('option', { name: '50' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, pageSize: 50 }),
    );
  });

  it('applies a column filter and requests a filtered fetch', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderTable();

    await user.click(screen.getByRole('button', { name: 'Filter by status' }));
    await user.type(screen.getByRole('textbox', { name: 'Filter by status' }), 'active');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: [{ id: 'status', title: 'Status', text: 'active', value: 'active' }],
      }),
    );
  });

  it('renders a filter chip for each active filter', () => {
    renderTable({ filters: [{ id: 'status', title: 'Status', text: 'active', value: 'active' }] });

    expect(screen.getByText('Status:')).toBeInTheDocument();
  });

  it('removes the filter and refetches when a chip is cleared', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderTable({
      filters: [{ id: 'status', title: 'Status', text: 'active', value: 'active' }],
    });

    await user.click(screen.getByRole('button', { name: 'Clear status filter' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(expect.objectContaining({ filters: [] }));
  });

  it('removes every filter when Clear All is activated', async () => {
    const user = userEvent.setup();
    const { onFetchRequested } = renderTable({
      filters: [{ id: 'status', title: 'Status', text: 'active', value: 'active' }],
    });

    await user.click(screen.getByRole('button', { name: 'Clear All' }));

    expect(onFetchRequested).toHaveBeenLastCalledWith(expect.objectContaining({ filters: [] }));
  });

  it('re-applies filters supplied via the filters prop when they change', () => {
    const { rerender, onFetchRequested } = renderTable();

    rerender(
      <Table<Row>
        columns={columns}
        data={rows}
        total={40}
        onFetchRequested={onFetchRequested}
        filters={[{ id: 'status', title: 'Status', text: 'active', value: 'active' }]}
      />,
    );

    expect(onFetchRequested).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: [{ id: 'status', title: 'Status', text: 'active', value: 'active' }],
      }),
    );
  });

  it('does not refetch when an equal filters array is supplied again', () => {
    const onFetchRequested = vi.fn();
    const filters = [{ id: 'status', title: 'Status', text: 'active', value: 'active' }];
    const { rerender } = render(
      <Table<Row>
        columns={columns}
        data={rows}
        total={40}
        onFetchRequested={onFetchRequested}
        filters={filters}
      />,
    );

    rerender(
      <Table<Row>
        columns={columns}
        data={rows}
        total={40}
        onFetchRequested={onFetchRequested}
        filters={[{ id: 'status', title: 'Status', text: 'active', value: 'active' }]}
      />,
    );

    expect(onFetchRequested).toHaveBeenCalledTimes(1);
  });

  it('hides pagination and the page size selector when isPaginated is false', () => {
    renderTable({ isPaginated: false });

    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Rows per page' })).not.toBeInTheDocument();
  });

  it('renders no selection column when no selection actions are available', () => {
    renderTable();

    expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).not.toBeInTheDocument();
  });

  it('renders the selection column when selection actions are available', () => {
    renderTable({ getSelectionActions: () => [{ id: 'archive', label: 'Archive' }] });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
  });

  it('reports the selected count in the toolbar', async () => {
    const user = userEvent.setup();
    renderTable({ getSelectionActions: () => [{ id: 'archive', label: 'Archive' }] });

    await user.click(screen.getByRole('checkbox', { name: 'Select row 1' }));

    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('selects every selectable row via select-all', async () => {
    const user = userEvent.setup();
    renderTable({
      getSelectionActions: () => [{ id: 'archive', label: 'Archive' }],
      isRowSelectable: (row) => !row.isLocked,
    });

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('passes the selection to the selection action handler', async () => {
    const user = userEvent.setup();
    const onSelectionActionClicked = vi.fn();
    renderTable({
      getSelectionActions: () => [{ id: 'archive', label: 'Archive' }],
      onSelectionActionClicked,
    });

    await user.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    await user.click(screen.getByRole('button', { name: 'Archive' }));

    expect(onSelectionActionClicked).toHaveBeenCalledWith('archive', [rows[0]]);
  });

  it('clears the selection after a selection action runs', async () => {
    const user = userEvent.setup();
    renderTable({
      getSelectionActions: () => [{ id: 'archive', label: 'Archive' }],
      onSelectionActionClicked: vi.fn(),
    });

    await user.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    await user.click(screen.getByRole('button', { name: 'Archive' }));

    expect(screen.queryByText('1 selected')).not.toBeInTheDocument();
  });

  it('renders the loading state instead of rows', () => {
    renderTable({ isLoading: true });

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('renders the empty state when there is no data', () => {
    renderTable({ data: [], total: 0 });

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders custom cell content in the body', () => {
    renderTable({
      columns: [
        columns[0],
        { ...columns[1], cell: (value) => <span data-testid="pill">{String(value)}</span> },
      ],
    });

    expect(screen.getAllByTestId('pill')).toHaveLength(2);
  });

  it('calls onRowClicked with the row when a row is activated', async () => {
    const user = userEvent.setup();
    const onRowClicked = vi.fn();
    renderTable({ onRowClicked });

    await user.click(screen.getByRole('button', { name: /Ada/ }));

    expect(onRowClicked).toHaveBeenCalledWith(rows[0]);
  });

  it('spreads className and passthrough props onto the root element', () => {
    const { container } = renderTable({ className: 'custom-class', 'data-testid': 'my-table' });

    expect(container.querySelector('.custom-class')).toHaveAttribute('data-testid', 'my-table');
  });
});
