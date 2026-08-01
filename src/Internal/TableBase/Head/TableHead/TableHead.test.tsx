import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTableStore } from '@/States/useTableState';

import TableHead from './TableHead';

import type { TableColumn } from '../../TableBase.types';
import type { TableStore } from '@/States/useTableState';

type Row = { name: string; locked?: boolean };

const columns: Array<TableColumn<Row>> = [
  { id: 'name', title: 'Name', accessor: (row) => row.name },
];

const rows: Row[] = [{ name: 'Ada' }, { name: 'Grace', locked: true }];

function createStore() {
  return createTableStore<Row>({ filters: [], pageSizeOptions: [20] });
}

function renderHead(
  overrides: Partial<Parameters<typeof TableHead<Row>>[0]> & { store?: TableStore<Row> } = {},
) {
  const { store = createStore(), ...rest } = overrides;
  const props = {
    store,
    columns,
    data: rows,
    onSortChanged: vi.fn(),
    ...rest,
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
    renderHead({ isSelectionEnabled: true });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).not.toBeChecked();
  });

  it('derives a checked select-all state when every selectable row is selected', () => {
    const store = createStore();
    act(() => store.getState().toggleRowSelection(rows[0], true));

    renderHead({
      store,
      isSelectionEnabled: true,
      isRowSelectable: (row) => !row.locked,
    });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeChecked();
  });

  it('derives an indeterminate select-all state when only some rows are selected', () => {
    const store = createStore();
    act(() => store.getState().toggleRowSelection(rows[0], true));

    renderHead({ store, isSelectionEnabled: true });

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('toggles selection for every selectable row when select-all is activated', async () => {
    const user = userEvent.setup();
    const { store } = renderHead({
      isSelectionEnabled: true,
      isRowSelectable: (row) => !row.locked,
    });

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(store.getState().selected).toEqual([rows[0]]);
  });
});
