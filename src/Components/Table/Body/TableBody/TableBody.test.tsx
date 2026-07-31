import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableBody from './TableBody';

import type { TableColumn } from '../../Table.types';

type Row = { name: string; status: string; locked?: boolean };

const columns: Array<TableColumn<Row>> = [
  { id: 'name', title: 'Name', accessor: (row) => row.name },
  { id: 'status', title: 'Status', accessor: (row) => row.status },
];

const rows: Row[] = [
  { name: 'Ada', status: 'active' },
  { name: 'Grace', status: 'archived', locked: true },
];

function renderBody(overrides: Partial<Parameters<typeof TableBody<Row>>[0]> = {}) {
  const props = {
    columns,
    data: rows,
    ...overrides,
  };

  render(
    <table>
      <TableBody<Row> {...props} />
    </table>,
  );

  return props;
}

describe('TableBody', () => {
  it('renders one row per data item', () => {
    renderBody();

    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('renders the accessed value as text when no custom cell is supplied', () => {
    renderBody();

    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
  });

  it('renders custom React content when a column supplies cell', () => {
    renderBody({
      columns: [
        columns[0],
        { ...columns[1], cell: (value) => <span data-testid="pill">{String(value)}</span> },
      ],
    });

    expect(screen.getAllByTestId('pill')).toHaveLength(2);
  });

  it('renders the loading indicator instead of rows when isLoading is true', () => {
    renderBody({ isLoading: true });

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Ada' })).not.toBeInTheDocument();
  });

  it('renders the default empty message when there is no data', () => {
    renderBody({ data: [] });

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders a consumer-supplied empty message', () => {
    renderBody({ data: [], emptyMessage: 'Nothing to show' });

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('does not render the empty message while loading', () => {
    renderBody({ data: [], isLoading: true });

    expect(screen.queryByText('No data found')).not.toBeInTheDocument();
  });

  it('spans the message cell across every column', () => {
    renderBody({ data: [], isSelectionEnabled: true });

    expect(screen.getByRole('cell')).toHaveAttribute('colspan', '3');
  });

  it('calls onRowClicked with the row when a row is activated', async () => {
    const user = userEvent.setup();
    const onRowClicked = vi.fn();
    renderBody({ onRowClicked });

    await user.click(screen.getAllByRole('button')[0]);

    expect(onRowClicked).toHaveBeenCalledWith(rows[0]);
  });

  it('marks selected rows as selected', () => {
    renderBody({ isSelectionEnabled: true, selectedRows: [rows[0]] });

    expect(screen.getByRole('checkbox', { name: 'Select row 1' })).toBeChecked();
  });

  it('disables the checkbox for rows rejected by isRowSelectable', () => {
    renderBody({ isSelectionEnabled: true, isRowSelectable: (row) => !row.locked });

    expect(screen.getByRole('checkbox', { name: 'Select row 2' })).toBeDisabled();
  });

  it('forwards row selection changes', async () => {
    const user = userEvent.setup();
    const onRowSelectChanged = vi.fn();
    renderBody({ isSelectionEnabled: true, onRowSelectChanged });

    await user.click(screen.getByRole('checkbox', { name: 'Select row 1' }));

    expect(onRowSelectChanged).toHaveBeenCalledWith(rows[0], true);
  });
});
