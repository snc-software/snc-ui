import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/Utils/cn';

import TableBody from './Body/TableBody';
import TableFilterPanel from './Filters/TableFilterPanel';
import TableHead from './Head/TableHead';
import Pagination from './Pagination';
import { DefaultPageSizeOptions } from './Table.constants';
import { classes } from './Table.styles';
import {
  applyFilters,
  areFiltersEqual,
  clearFilters,
  toggleRowSelection,
  toggleSelectAll,
} from './Table.utils';
import TableToolbar from './TableToolbar';

import type { TableFilter, TableProps, TableSortDirection } from './Table.types';

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
  const [activeFilters, setActiveFilters] = useState<TableFilter[]>(filters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    initialPageSize && pageSizeOptions.includes(initialPageSize)
      ? initialPageSize
      : pageSizeOptions[0],
  );
  const [selected, setSelected] = useState<Array<TRow>>([]);
  const [sortBy, setSortBy] = useState<string>();
  const [sortDirection, setSortDirection] = useState<TableSortDirection>();

  const selectionActions = getSelectionActions?.(selected) ?? [];
  const isSelectionEnabled = selectionActions.length > 0;

  // Syncs the `filters` prop into local state, but only when the *prop itself* changes by value.
  // Comparing against local state instead would wipe any filter applied through a column menu: the
  // prop defaults to a fresh `[]` on every render, which would always differ from the applied filter
  // and reset it on the very next render.
  const lastSyncedFilters = useRef(filters);

  useEffect(() => {
    if (areFiltersEqual(lastSyncedFilters.current, filters)) {
      return;
    }

    lastSyncedFilters.current = filters;
    setActiveFilters(filters);
  }, [filters]);

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

  const handleFiltersSet = useCallback((incoming: TableFilter[]) => {
    setActiveFilters((current) => applyFilters(current, incoming));
    setPage(1);
  }, []);

  const handleFiltersCleared = useCallback((filterIds: string[]) => {
    setActiveFilters((current) => clearFilters(current, filterIds));
    setPage(1);
  }, []);

  const handleAllFiltersCleared = useCallback(() => {
    setActiveFilters([]);
    setPage(1);
  }, []);

  const handlePageSizeChanged = useCallback((newPageSize: number) => {
    setPage(1);
    setPageSize(newPageSize);
  }, []);

  const handleSelectAllClicked = useCallback(() => {
    setSelected((current) => toggleSelectAll(data, current, isRowSelectable));
  }, [data, isRowSelectable]);

  const handleRowSelectChanged = useCallback((row: TRow, isSelected: boolean) => {
    setSelected((current) => toggleRowSelection(current, row, isSelected));
  }, []);

  const handleSelectionActionClicked = useCallback(
    (actionId: string, selectedRows: Array<TRow>) => {
      onSelectionActionClicked?.(actionId, selectedRows);
      setSelected([]);
    },
    [onSelectionActionClicked],
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
          onSelectionCleared={() => setSelected([])}
          onPageSizeChanged={handlePageSizeChanged}
        />
      )}

      {activeFilters.length > 0 && (
        <TableFilterPanel
          filters={activeFilters}
          onFilterCleared={(filterId) => handleFiltersCleared([filterId])}
          onAllFiltersCleared={handleAllFiltersCleared}
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
              onSelectAllClicked={handleSelectAllClicked}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChanged={handleSortChanged}
              onFiltersSet={handleFiltersSet}
              onFiltersCleared={handleFiltersCleared}
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
              onRowSelectChanged={handleRowSelectChanged}
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
