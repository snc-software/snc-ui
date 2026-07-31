import { useState } from 'react';
import { createStore } from 'zustand';

import {
  applyFilters,
  areFiltersEqual,
  clearFilters,
  toggleRowSelection,
  toggleSelectAll,
} from '@/Components/Table/Table.utils';

import type { TableState, TableStateParams, TableStore } from './useTableState.types';
import type { TableFilter } from '@/Components/Table';

// Tracks the last-synced prop value separately from `activeFilters`, which may have since diverged
// (e.g. a filter applied through a column menu) — comparing against `activeFilters` instead would
// clobber that on the next render, since `filters` defaults to a fresh `[]` reference every render.
type InternalTableState<TRow extends object> = TableState<TRow> & {
  lastSyncedFilters: TableFilter[];
};

function resolveInitialPageSize(initialPageSize: number | undefined, pageSizeOptions: number[]) {
  return initialPageSize && pageSizeOptions.includes(initialPageSize)
    ? initialPageSize
    : pageSizeOptions[0];
}

export function createTableStore<TRow extends object>({
  filters,
  initialPageSize,
  pageSizeOptions,
}: TableStateParams): TableStore<TRow> {
  return createStore<InternalTableState<TRow>>()((set) => ({
    page: 1,
    pageSize: resolveInitialPageSize(initialPageSize, pageSizeOptions),
    activeFilters: filters,
    lastSyncedFilters: filters,
    selected: [],

    setPage: (page) => set({ page }),

    setPageSize: (pageSize) => set({ pageSize, page: 1 }),

    applyFilters: (incoming) =>
      set((state) => ({ activeFilters: applyFilters(state.activeFilters, incoming), page: 1 })),

    clearFilters: (filterIds) =>
      set((state) => ({ activeFilters: clearFilters(state.activeFilters, filterIds), page: 1 })),

    clearAllFilters: () => set({ activeFilters: [], page: 1 }),

    syncFilters: (nextFilters) =>
      set((state) =>
        areFiltersEqual(state.lastSyncedFilters, nextFilters)
          ? state
          : { activeFilters: nextFilters, lastSyncedFilters: nextFilters },
      ),

    toggleSelectAll: (data, isRowSelectable) =>
      set((state) => ({ selected: toggleSelectAll(data, state.selected, isRowSelectable) })),

    toggleRowSelection: (row, isSelected) =>
      set((state) => ({ selected: toggleRowSelection(state.selected, row, isSelected) })),

    clearSelection: () => set({ selected: [] }),
  }));
}

// Store is created once per call (via useState's lazy initializer), so multiple `Table`s on the same
// page never share state. Returns the raw store rather than subscribed state — consumers subscribe
// themselves via zustand's `useStore(store, selector)` so each reads only the slice it needs.
export function useTableState<TRow extends object>(params: TableStateParams): TableStore<TRow> {
  const [store] = useState(() => createTableStore<TRow>(params));

  return store;
}
