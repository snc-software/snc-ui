import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TableHead from './TableHead';

import type { TableColumn, TableFilter } from '../../Table.types';

type Row = { name: string; locked?: boolean };

const columns: Array<TableColumn<Row>> = [
  { id: 'name', title: 'Name', accessor: (row) => row.name },
];

const rows: Row[] = [{ name: 'Ada' }, { name: 'Grace', locked: true }];

function renderHead(overrides: Partial<Parameters<typeof TableHead<Row>>[0]> = {}) {
  const props = {
    columns,
    data: rows,
    filters: [] as TableFilter[],
    onSelectAllClicked: vi.fn(),
    onSortChanged: vi.fn(),
    onFiltersSet: vi.fn(),
    onFiltersCleared: vi.fn(),
    ...overrides,
  };

  render(
    <table>
      <TableHead<Row> {...props} />
    </table>,
  );

  return props;
}

describe('TableHead', () => {
  it('renders a header row with a header per column', () => {
    renderHead();

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('renders no select-all checkbox when selection is disabled', () => {
    renderHead();

    expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).not.toBeInTheDocument();
  });

  it('derives an unchecked select-all state when nothing is selected', () => {
    renderHead({ isSelectionEnabled: true, selectedRows: [] });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).not.toBeChecked();
  });

  it('derives a checked select-all state when every selectable row is selected', () => {
    renderHead({
      isSelectionEnabled: true,
      selectedRows: [rows[0]],
      isRowSelectable: (row) => !row.locked,
    });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeChecked();
  });

  it('derives an indeterminate select-all state when only some rows are selected', () => {
    renderHead({ isSelectionEnabled: true, selectedRows: [rows[0]] });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('forwards select-all activation to the handler', async () => {
    const user = userEvent.setup();
    const props = renderHead({ isSelectionEnabled: true });

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(props.onSelectAllClicked).toHaveBeenCalledTimes(1);
  });
});
