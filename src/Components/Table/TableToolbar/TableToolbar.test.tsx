import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTableStore } from '@/States/useTableState';

import TableToolbar from './TableToolbar';

import type { TableStore } from '@/States/useTableState';

type Row = { name: string };

const rows: Row[] = [{ name: 'Ada' }, { name: 'Grace' }];

function createStore(overrides: Partial<Parameters<typeof createTableStore<Row>>[0]> = {}) {
  return createTableStore<Row>({
    filters: [],
    pageSizeOptions: [20, 50, 100],
    ...overrides,
  });
}

function renderToolbar(
  overrides: Partial<Parameters<typeof TableToolbar<Row>>[0]> & { store?: TableStore<Row> } = {},
) {
  const { store = createStore(), ...rest } = overrides;
  const props = {
    store,
    dataLength: 2,
    total: 50,
    pageSizeOptions: [20, 50, 100],
    ...rest,
  };

  render(<TableToolbar<Row> {...props} />);

  return props;
}

describe('TableToolbar', () => {
  it('renders the showing-n-of-m row count', () => {
    renderToolbar();

    expect(screen.getByText('Showing 1 - 2 of 50')).toBeInTheDocument();
  });

  it('offsets the row count by the current page', () => {
    const store = createStore();
    act(() => store.getState().setPage(3));

    renderToolbar({ store, dataLength: 10 });

    expect(screen.getByText('Showing 41 - 50 of 50')).toBeInTheDocument();
  });

  it('reports a zero start when there are no rows', () => {
    renderToolbar({ dataLength: 0, total: 0 });

    expect(screen.getByText('Showing 0 - 0 of 0')).toBeInTheDocument();
  });

  it('renders the page size selector when paginated', () => {
    renderToolbar();

    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument();
  });

  it('hides the page size selector when not paginated', () => {
    renderToolbar({ isPaginated: false });

    expect(screen.queryByRole('combobox', { name: 'Rows per page' })).not.toBeInTheDocument();
  });

  it('calls setPageSize on the store when a new size is chosen', async () => {
    const user = userEvent.setup();
    const { store } = renderToolbar();

    await user.click(screen.getByRole('combobox', { name: 'Rows per page' }));
    await user.click(screen.getByRole('option', { name: '50' }));

    expect(store.getState().pageSize).toBe(50);
  });

  it('renders no selection summary when nothing is selected', () => {
    renderToolbar();

    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('renders the selected count when rows are selected', () => {
    const store = createStore();
    act(() => store.getState().toggleSelectAll(rows));

    renderToolbar({ store });

    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('clears the selection when the clear control is activated', async () => {
    const user = userEvent.setup();
    const store = createStore();
    act(() => store.getState().toggleSelectAll(rows));

    renderToolbar({ store });

    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(store.getState().selected).toEqual([]);
  });

  it('renders toolbar actions and calls onActionClicked with the action id', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();
    renderToolbar({ actions: [{ id: 'export', label: 'Export' }], onActionClicked });

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(onActionClicked).toHaveBeenCalledWith('export');
  });

  it('renders selection actions only when rows are selected', () => {
    renderToolbar({ selectionActions: [{ id: 'delete', label: 'Delete' }] });

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('calls onSelectionActionClicked with the action id and the selection', async () => {
    const user = userEvent.setup();
    const onSelectionActionClicked = vi.fn();
    const store = createStore();
    act(() => store.getState().toggleSelectAll(rows));

    renderToolbar({
      store,
      selectionActions: [{ id: 'delete', label: 'Delete' }],
      onSelectionActionClicked,
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onSelectionActionClicked).toHaveBeenCalledWith('delete', rows);
  });

  it('hides toolbar actions when hideActionsWhenRowsSelected is true and rows are selected', () => {
    const store = createStore();
    act(() => store.getState().toggleSelectAll(rows));

    renderToolbar({
      store,
      actions: [{ id: 'export', label: 'Export' }],
      hideActionsWhenRowsSelected: true,
    });

    expect(screen.queryByRole('button', { name: 'Export' })).not.toBeInTheDocument();
  });

  it('keeps toolbar actions visible when rows are selected by default', () => {
    const store = createStore();
    act(() => store.getState().toggleSelectAll(rows));

    renderToolbar({ store, actions: [{ id: 'export', label: 'Export' }] });

    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('disables an action marked as disabled', () => {
    renderToolbar({ actions: [{ id: 'export', label: 'Export', disabled: true }] });

    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
  });
});
