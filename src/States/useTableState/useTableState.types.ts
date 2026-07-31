import type { TableFilter } from '@/Components/Table';

export type TableStateParams = {
  /**
   * Filters to pre-apply.
   */
  filters: TableFilter[];
  /**
   * Ignored unless it appears in `pageSizeOptions`; falls back to `pageSizeOptions[0]` otherwise.
   */
  initialPageSize?: number;
  pageSizeOptions: number[];
};

export type TableState<TRow extends object> = {
  page: number;
  pageSize: number;
  activeFilters: TableFilter[];
  selected: TRow[];
  setPage: (page: number) => void;
  /**
   * Also resets `page` to `1`.
   */
  setPageSize: (pageSize: number) => void;
  /**
   * Merges `incoming` into `activeFilters` and resets `page` to `1`.
   */
  applyFilters: (incoming: TableFilter[]) => void;
  /**
   * Removes the filters matching `filterIds` and resets `page` to `1`.
   */
  clearFilters: (filterIds: string[]) => void;
  /**
   * Clears every active filter and resets `page` to `1`.
   */
  clearAllFilters: () => void;
  /**
   * Reconciles the `filters` prop into `activeFilters`. No-ops when equal-by-value to the last value
   * synced, so it's safe to call every render without clobbering a filter applied via a column menu.
   */
  syncFilters: (filters: TableFilter[]) => void;
  /**
   * Rows from other pages already in `selected` are preserved.
   */
  toggleSelectAll: (data: TRow[], isRowSelectable?: (row: TRow) => boolean) => void;
  toggleRowSelection: (row: TRow, isSelected: boolean) => void;
  clearSelection: () => void;
};
