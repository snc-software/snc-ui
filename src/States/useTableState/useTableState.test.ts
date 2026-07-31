import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useTableState } from './useTableState';

import type { TableStateParams } from './useTableState.types';
import type { TableFilter } from '@/Components/Table';

type Row = { id: number; locked?: boolean };

const rows: Row[] = [{ id: 1 }, { id: 2, locked: true }, { id: 3 }];
const isRowSelectable = (row: Row) => !row.locked;

function renderTableState(overrides: Partial<TableStateParams> = {}) {
  return renderHook(() =>
    useTableState<Row>({
      filters: [],
      pageSizeOptions: [10, 20, 50],
      ...overrides,
    }),
  );
}

describe('useTableState', () => {
  it('initializes page to 1 and activeFilters to the supplied filters', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const { result } = renderTableState({ filters });

    expect(result.current.page).toBe(1);
    expect(result.current.activeFilters).toBe(filters);
  });

  it('initializes pageSize to the supplied initialPageSize when present in pageSizeOptions', () => {
    const { result } = renderTableState({ initialPageSize: 20 });

    expect(result.current.pageSize).toBe(20);
  });

  it('falls back to pageSizeOptions[0] when initialPageSize is absent or not an option', () => {
    const { result } = renderTableState({ initialPageSize: 999 });

    expect(result.current.pageSize).toBe(10);
  });

  it('initializes selected to an empty array', () => {
    const { result } = renderTableState();

    expect(result.current.selected).toEqual([]);
  });

  it('setPage updates page without touching other state', () => {
    const { result } = renderTableState();

    act(() => result.current.setPage(3));

    expect(result.current.page).toBe(3);
    expect(result.current.activeFilters).toEqual([]);
    expect(result.current.selected).toEqual([]);
  });

  it('setPageSize updates pageSize and resets page to 1', () => {
    const { result } = renderTableState();

    act(() => result.current.setPage(3));
    act(() => result.current.setPageSize(50));

    expect(result.current.pageSize).toBe(50);
    expect(result.current.page).toBe(1);
  });

  it('applyFilters merges into activeFilters and resets page to 1', () => {
    const { result } = renderTableState();

    act(() => result.current.setPage(3));
    act(() => result.current.applyFilters([{ id: 'status', title: 'Status', value: 'active' }]));

    expect(result.current.activeFilters).toEqual([
      { id: 'status', title: 'Status', value: 'active' },
    ]);
    expect(result.current.page).toBe(1);
  });

  it('applyFilters removes a filter whose incoming value is empty', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const { result } = renderTableState({ filters });

    act(() => result.current.applyFilters([{ id: 'status', title: 'Status', value: '' }]));

    expect(result.current.activeFilters).toEqual([]);
  });

  it('clearFilters removes only the targeted filter ids and resets page to 1', () => {
    const filters: TableFilter[] = [
      { id: 'status', title: 'Status', value: 'active' },
      { id: 'owner', title: 'Owner', value: 'ada' },
    ];
    const { result } = renderTableState({ filters });

    act(() => result.current.setPage(3));
    act(() => result.current.clearFilters(['status']));

    expect(result.current.activeFilters).toEqual([{ id: 'owner', title: 'Owner', value: 'ada' }]);
    expect(result.current.page).toBe(1);
  });

  it('clearAllFilters clears every filter and resets page to 1', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const { result } = renderTableState({ filters });

    act(() => result.current.setPage(3));
    act(() => result.current.clearAllFilters());

    expect(result.current.activeFilters).toEqual([]);
    expect(result.current.page).toBe(1);
  });

  it('syncFilters replaces activeFilters when the incoming array differs from the current one', () => {
    const { result } = renderTableState();
    const nextFilters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];

    act(() => result.current.syncFilters(nextFilters));

    expect(result.current.activeFilters).toBe(nextFilters);
  });

  it('syncFilters is a no-op when the incoming array is equal-by-value to the last one it synced', () => {
    const filters: TableFilter[] = [{ id: 'status', title: 'Status', value: 'active' }];
    const { result } = renderTableState({ filters });

    act(() => result.current.syncFilters([{ id: 'status', title: 'Status', value: 'active' }]));

    expect(result.current.activeFilters).toBe(filters);
  });

  it('syncFilters does not clobber a filter applied locally (e.g. via a column menu) when called again with the unchanged prop value', () => {
    const { result } = renderTableState({ filters: [] });

    act(() => result.current.applyFilters([{ id: 'status', title: 'Status', value: 'active' }]));
    act(() => result.current.syncFilters([]));

    expect(result.current.activeFilters).toEqual([
      { id: 'status', title: 'Status', value: 'active' },
    ]);
  });

  it('toggleSelectAll selects every selectable row when none are selected, without resetting page', () => {
    const { result } = renderTableState();

    act(() => result.current.setPage(3));
    act(() => result.current.toggleSelectAll(rows, isRowSelectable));

    expect(result.current.selected).toEqual([rows[0], rows[2]]);
    expect(result.current.page).toBe(3);
  });

  it('toggleSelectAll deselects every selectable row when all are already selected', () => {
    const { result } = renderTableState();

    act(() => result.current.toggleSelectAll(rows, isRowSelectable));
    act(() => result.current.toggleSelectAll(rows, isRowSelectable));

    expect(result.current.selected).toEqual([]);
  });

  it('toggleRowSelection adds a single row to selected without affecting other rows or page', () => {
    const { result } = renderTableState();

    act(() => result.current.setPage(3));
    act(() => result.current.toggleRowSelection(rows[0], true));

    expect(result.current.selected).toEqual([rows[0]]);
    expect(result.current.page).toBe(3);
  });

  it('toggleRowSelection removes a single row from selected', () => {
    const { result } = renderTableState();

    act(() => result.current.toggleRowSelection(rows[0], true));
    act(() => result.current.toggleRowSelection(rows[1], true));
    act(() => result.current.toggleRowSelection(rows[0], false));

    expect(result.current.selected).toEqual([rows[1]]);
  });

  it('clearSelection empties selected', () => {
    const { result } = renderTableState();

    act(() => result.current.toggleRowSelection(rows[0], true));
    act(() => result.current.clearSelection());

    expect(result.current.selected).toEqual([]);
  });

  it('keeps state fully independent across two separate instances', () => {
    const { result: first } = renderTableState();
    const { result: second } = renderTableState();

    act(() => {
      first.current.setPage(3);
      first.current.applyFilters([{ id: 'status', title: 'Status', value: 'active' }]);
      first.current.toggleRowSelection(rows[0], true);
    });

    expect(second.current.page).toBe(1);
    expect(second.current.activeFilters).toEqual([]);
    expect(second.current.selected).toEqual([]);
  });
});
