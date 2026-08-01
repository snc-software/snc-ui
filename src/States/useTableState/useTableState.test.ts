import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createTableStore } from './useTableState';

import type { TableStateParams } from './useTableState.types';
import type { TableFilter } from '@/Internal/TableBase';

type Row = { id: number; locked?: boolean };

const rows: Row[] = [{ id: 1 }, { id: 2, locked: true }, { id: 3 }];
const isRowSelectable = (row: Row) => !row.locked;

function createStore(overrides: Partial<TableStateParams> = {}) {
  return createTableStore<Row>({
    filters: [],
    pageSizeOptions: [10, 20, 50],
    ...overrides,
  });
}

describe('createTableStore', () => {
  it('initializes page to 1 and activeFilters to the supplied filters', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const store = createStore({ filters });

    expect(store.getState().page).toBe(1);
    expect(store.getState().activeFilters).toBe(filters);
  });

  it('initializes pageSize to the supplied initialPageSize when present in pageSizeOptions', () => {
    const store = createStore({ initialPageSize: 20 });

    expect(store.getState().pageSize).toBe(20);
  });

  it('falls back to pageSizeOptions[0] when initialPageSize is absent or not an option', () => {
    const store = createStore({ initialPageSize: 999 });

    expect(store.getState().pageSize).toBe(10);
  });

  it('initializes selected to an empty array', () => {
    const store = createStore();

    expect(store.getState().selected).toEqual([]);
  });

  it('setPage updates page without touching other state', () => {
    const store = createStore();

    act(() => store.getState().setPage(3));

    expect(store.getState().page).toBe(3);
    expect(store.getState().activeFilters).toEqual([]);
    expect(store.getState().selected).toEqual([]);
  });

  it('setPageSize updates pageSize and resets page to 1', () => {
    const store = createStore();

    act(() => store.getState().setPage(3));
    act(() => store.getState().setPageSize(50));

    expect(store.getState().pageSize).toBe(50);
    expect(store.getState().page).toBe(1);
  });

  it('applyFilters merges into activeFilters and resets page to 1', () => {
    const store = createStore();

    act(() => store.getState().setPage(3));
    act(() => store.getState().applyFilters([{ id: 'status', title: 'Status', value: 'active' }]));

    expect(store.getState().activeFilters).toEqual([
      { id: 'status', title: 'Status', value: 'active' },
    ]);
    expect(store.getState().page).toBe(1);
  });

  it('applyFilters removes a filter whose incoming value is empty', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const store = createStore({ filters });

    act(() => store.getState().applyFilters([{ id: 'status', title: 'Status', value: '' }]));

    expect(store.getState().activeFilters).toEqual([]);
  });

  it('clearFilters removes only the targeted filter ids and resets page to 1', () => {
    const filters: TableFilter[] = [
      { id: 'status', title: 'Status', value: 'active' },
      { id: 'owner', title: 'Owner', value: 'ada' },
    ];
    const store = createStore({ filters });

    act(() => store.getState().setPage(3));
    act(() => store.getState().clearFilters(['status']));

    expect(store.getState().activeFilters).toEqual([{ id: 'owner', title: 'Owner', value: 'ada' }]);
    expect(store.getState().page).toBe(1);
  });

  it('clearAllFilters clears every filter and resets page to 1', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const store = createStore({ filters });

    act(() => store.getState().setPage(3));
    act(() => store.getState().clearAllFilters());

    expect(store.getState().activeFilters).toEqual([]);
    expect(store.getState().page).toBe(1);
  });

  it('syncFilters replaces activeFilters when the incoming array differs from the current one', () => {
    const store = createStore();
    const nextFilters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];

    act(() => store.getState().syncFilters(nextFilters));

    expect(store.getState().activeFilters).toBe(nextFilters);
  });

  it('syncFilters is a no-op when the incoming array is equal-by-value to the last one it synced', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const store = createStore({ filters });

    act(() => store.getState().syncFilters([{ id: 'status', title: 'Status', value: 'active' }]));

    expect(store.getState().activeFilters).toBe(filters);
  });

  it('syncFilters does not clobber a filter applied locally (e.g. via a column menu) when called again with the unchanged prop value', () => {
    const store = createStore({ filters: [] });

    act(() => store.getState().applyFilters([{ id: 'status', title: 'Status', value: 'active' }]));
    act(() => store.getState().syncFilters([]));

    expect(store.getState().activeFilters).toEqual([
      { id: 'status', title: 'Status', value: 'active' },
    ]);
  });

  it('toggleSelectAll selects every selectable row when none are selected, without resetting page', () => {
    const store = createStore();

    act(() => store.getState().setPage(3));
    act(() => store.getState().toggleSelectAll(rows, isRowSelectable));

    expect(store.getState().selected).toEqual([rows[0], rows[2]]);
    expect(store.getState().page).toBe(3);
  });

  it('toggleSelectAll deselects every selectable row when all are already selected', () => {
    const store = createStore();

    act(() => store.getState().toggleSelectAll(rows, isRowSelectable));
    act(() => store.getState().toggleSelectAll(rows, isRowSelectable));

    expect(store.getState().selected).toEqual([]);
  });

  it('toggleRowSelection adds a single row to selected without affecting other rows or page', () => {
    const store = createStore();

    act(() => store.getState().setPage(3));
    act(() => store.getState().toggleRowSelection(rows[0], true));

    expect(store.getState().selected).toEqual([rows[0]]);
    expect(store.getState().page).toBe(3);
  });

  it('toggleRowSelection removes a single row from selected', () => {
    const store = createStore();

    act(() => store.getState().toggleRowSelection(rows[0], true));
    act(() => store.getState().toggleRowSelection(rows[1], true));
    act(() => store.getState().toggleRowSelection(rows[0], false));

    expect(store.getState().selected).toEqual([rows[1]]);
  });

  it('clearSelection empties selected', () => {
    const store = createStore();

    act(() => store.getState().toggleRowSelection(rows[0], true));
    act(() => store.getState().clearSelection());

    expect(store.getState().selected).toEqual([]);
  });

  it('keeps state fully independent across two separate instances', () => {
    const first = createStore();
    const second = createStore();

    act(() => {
      first.getState().setPage(3);
      first.getState().applyFilters([{ id: 'status', title: 'Status', value: 'active' }]);
      first.getState().toggleRowSelection(rows[0], true);
    });

    expect(second.getState().page).toBe(1);
    expect(second.getState().activeFilters).toEqual([]);
    expect(second.getState().selected).toEqual([]);
  });
});
