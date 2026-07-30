import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableHeadRow from './TableHeadRow';

import type { TableColumn, TableFilter } from '../../Table.types';

type Row = { name: string; status: string };

const columns: Array<TableColumn<Row>> = [
  { id: 'name', title: 'Name', accessor: (row) => row.name, isSortable: true },
  { id: 'status', title: 'Status', accessor: (row) => row.status },
];

function renderRow(overrides: Partial<Parameters<typeof TableHeadRow<Row>>[0]> = {}) {
  const props = {
    columns,
    filters: [] as TableFilter[],
    selectionState: { checked: false, indeterminate: false },
    onSelectAllClicked: vi.fn(),
    onSortChanged: vi.fn(),
    onFiltersSet: vi.fn(),
    onFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(
    <table>
      <thead>
        <TableHeadRow<Row> {...props} />
      </thead>
    </table>,
  );

  return props;
}

describe('TableHeadRow', () => {
  it('renders one column header per column', () => {
    renderRow();

    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });

  it('renders each column title', () => {
    renderRow();

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  });

  it('renders a sort control only for sortable columns', () => {
    renderRow();

    expect(screen.getByRole('button', { name: 'Sort by name' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sort by status' })).not.toBeInTheDocument();
  });

  it('does not render the select-all cell when selection is disabled', () => {
    renderRow();

    expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).not.toBeInTheDocument();
  });

  it('renders the select-all cell when selection is enabled', () => {
    renderRow({ isSelectionEnabled: true });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
  });

  it('reflects the checked selection state on the select-all checkbox', () => {
    renderRow({
      isSelectionEnabled: true,
      selectionState: { checked: true, indeterminate: false },
    });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeChecked();
  });

  it('reflects the indeterminate selection state on the select-all checkbox', () => {
    renderRow({
      isSelectionEnabled: true,
      selectionState: { checked: false, indeterminate: true },
    });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('calls onSelectAllClicked when the select-all checkbox is activated', async () => {
    const user = userEvent.setup();
    const props = renderRow({ isSelectionEnabled: true });

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(props.onSelectAllClicked).toHaveBeenCalledTimes(1);
  });

  it('passes the sort direction only to the sorted column', () => {
    renderRow({ sortBy: 'name', sortDirection: 'asc' });

    expect(screen.getByRole('columnheader', { name: /name/i })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('trims the left border on the first column when selection is disabled', () => {
    renderRow();

    expect(screen.getByTestId('head-cell-name').className).toContain('snc:border-l-0');
  });

  it('keeps the left border on the first column when selection is enabled', () => {
    renderRow({ isSelectionEnabled: true });

    expect(screen.getByTestId('head-cell-name').className).not.toContain('snc:border-l-0');
  });

  it('trims the right border on the last column', () => {
    renderRow();

    expect(screen.getByTestId('head-cell-status').className).toContain('snc:border-r-0');
  });
});
