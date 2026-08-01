import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import { useTableState } from '@/States/useTableState';

import type {
  UseTableControllerOptions,
  UseTableControllerResult,
} from './useTableController.types';
import type { TableSortDirection } from '@/Internal/TableBase';

/**
 * Everything a table does that isn't layout: it owns the store, the sort, the filter reconciliation,
 * the fetch lifecycle and the selection-action handling.
 *
 * Extracted so `Table` and `MasterDetailsTable` share one implementation of the behaviour rather than
 * two copies that drift — the layout is all that differs between them.
 */
export function useTableController<TRow extends object>({
  filters,
  onFetchRequested,
  initialPageSize,
  pageSizeOptions,
  getSelectionActions,
  onSelectionActionClicked,
  actions,
  isPaginated,
}: UseTableControllerOptions<TRow>): UseTableControllerResult<TRow> {
  const store = useTableState<TRow>({ filters, initialPageSize, pageSizeOptions });

  const page = useStore(store, (state) => state.page);
  const pageSize = useStore(store, (state) => state.pageSize);
  const activeFilters = useStore(store, (state) => state.activeFilters);
  const selected = useStore(store, (state) => state.selected);
  const syncFilters = useStore(store, (state) => state.syncFilters);
  const clearSelection = useStore(store, (state) => state.clearSelection);

  const [sortBy, setSortBy] = useState<string>();
  const [sortDirection, setSortDirection] = useState<TableSortDirection>();

  const selectionActions = getSelectionActions?.(selected) ?? [];
  const isSelectionEnabled = selectionActions.length > 0;

  // `syncFilters` tracks the last `filters` value it synced internally, so this effect can safely run
  // whenever the (by-reference-unstable) `filters` prop changes without wiping a filter applied through
  // a column menu.
  useEffect(() => {
    syncFilters(filters);
  }, [filters, syncFilters]);

  // Held in a ref so an inline arrow function from the consumer doesn't re-trigger a fetch on every
  // render — the fetch depends on the table's state, not on the callback's identity. Updated in an
  // effect rather than during render, and declared before the fetch effect so it is always current by
  // the time that one runs.
  const onFetchRequestedRef = useRef(onFetchRequested);

  useEffect(() => {
    onFetchRequestedRef.current = onFetchRequested;
  }, [onFetchRequested]);

  useEffect(() => {
    onFetchRequestedRef.current({
      filters: activeFilters,
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
  }, [activeFilters, page, pageSize, sortBy, sortDirection]);

  const handleSortChanged = useCallback(
    (columnId: string, direction: TableSortDirection | undefined) => {
      setSortBy(direction ? columnId : undefined);
      setSortDirection(direction);
    },
    [],
  );

  const handleSelectionActionClicked = useCallback(
    (actionId: string, selectedRows: Array<TRow>) => {
      onSelectionActionClicked?.(actionId, selectedRows);
      clearSelection();
    },
    [onSelectionActionClicked, clearSelection],
  );

  return {
    store,
    activeFilters,
    sortBy,
    sortDirection,
    selectionActions,
    isSelectionEnabled,
    isToolbarVisible: actions.length > 0 || isSelectionEnabled || isPaginated,
    onSortChanged: handleSortChanged,
    onSelectionActionClicked: handleSelectionActionClicked,
  };
}
