import { useCallback, useEffect, useRef, useState } from 'react';

import { useTableState } from '@/States/useTableState';
import { cn } from '@/Utils/cn';

import TableBody from './Body/TableBody';
import TableFilterPanel from './Filters/TableFilterPanel';
import TableHead from './Head/TableHead';
import Pagination from './Pagination';
import { DefaultPageSizeOptions } from './Table.constants';
import { classes } from './Table.styles';
import TableToolbar from './TableToolbar';

import type { TableProps, TableSortDirection } from './Table.types';

export default function Table<TRow extends object>({
  columns,
  data = [],
  total,
  filters = [],
  onFetchRequested,
  onRowClicked,
  isLoading = false,
  isRowSelectable,
  getSelectionActions,
  onSelectionActionClicked,
  actions = [],
  onActionClicked,
  hideActionsWhenRowsSelected = false,
  isPaginated = true,
  pageSize: initialPageSize,
  pageSizeOptions = DefaultPageSizeOptions,
  emptyMessage,
  className,
  ...rest
}: TableProps<TRow>) {
  const {
    page,
    pageSize,
    activeFilters,
    selected,
    setPage,
    setPageSize,
    applyFilters,
    clearFilters,
    clearAllFilters,
    syncFilters,
    toggleSelectAll,
    toggleRowSelection,
    clearSelection,
  } = useTableState<TRow>({ filters, initialPageSize, pageSizeOptions });

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

  const isToolbarVisible = actions.length > 0 || isSelectionEnabled || isPaginated;

  return (
    <div className={cn(classes.root, className)} {...rest}>
      {isToolbarVisible && (
        <TableToolbar<TRow>
          dataLength={data.length}
          total={total}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          isPaginated={isPaginated}
          actions={actions}
          onActionClicked={onActionClicked}
          hideActionsWhenRowsSelected={hideActionsWhenRowsSelected}
          selected={selected}
          selectionActions={selectionActions}
          onSelectionActionClicked={handleSelectionActionClicked}
          onSelectionCleared={clearSelection}
          onPageSizeChanged={setPageSize}
        />
      )}

      {activeFilters.length > 0 && (
        <TableFilterPanel
          filters={activeFilters}
          onFilterCleared={(filterId) => clearFilters([filterId])}
          onAllFiltersCleared={clearAllFilters}
        />
      )}

      <div className={classes.surface}>
        <div className={classes.scrollArea}>
          <table className={classes.table}>
            <TableHead<TRow>
              columns={columns}
              data={data}
              filters={activeFilters}
              isSelectionEnabled={isSelectionEnabled}
              selectedRows={selected}
              isRowSelectable={isRowSelectable}
              onSelectAllClicked={() => toggleSelectAll(data, isRowSelectable)}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChanged={handleSortChanged}
              onFiltersSet={applyFilters}
              onFiltersCleared={clearFilters}
            />
            <TableBody<TRow>
              columns={columns}
              data={data}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              isSelectionEnabled={isSelectionEnabled}
              selectedRows={selected}
              isRowSelectable={isRowSelectable}
              onRowClicked={onRowClicked}
              onRowSelectChanged={toggleRowSelection}
            />
          </table>
        </div>

        {isPaginated && (
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        )}
      </div>
    </div>
  );
}
