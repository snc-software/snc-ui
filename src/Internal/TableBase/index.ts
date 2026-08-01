// The building blocks every table layout is assembled from. `Table` and `MasterDetailsTable` are both
// compositions over this module — neither owns the parts, and neither reaches into the other's folder.
//
// Internal by design: nothing here is exported from the library root. The public vocabulary types are
// re-exported from `@/Components/Table`, which remains the single place a consumer imports them from.
export { default as TableBody } from './Body/TableBody';
export { default as TableFilterPanel } from './Filters/TableFilterPanel';
export { default as TableHead } from './Head/TableHead';
export { default as PageSizeSelector } from './PageSizeSelector';
export { default as Pagination } from './Pagination';
export { default as TableToolbar } from './TableToolbar';

export { DefaultEmptyMessage, DefaultPageSizeOptions } from './TableBase.constants';
export { classes } from './TableBase.styles';
export {
  applyFilters,
  areFiltersEqual,
  clearFilters,
  getNextSortDirection,
  getPageCount,
  getPageNumbers,
  getSelectableRows,
  getSelectionState,
  toggleRowSelection,
  toggleSelectAll,
} from './TableBase.utils';

export type { TableBodyProps } from './Body/TableBody';
export type { TableFilterPanelProps } from './Filters/TableFilterPanel';
export type { TableHeadProps } from './Head/TableHead';
export type { PageSizeSelectorProps } from './PageSizeSelector';
export type { PaginationProps } from './Pagination';
export type { TableToolbarProps } from './TableToolbar';
export type { TableSelectionState } from './TableBase.utils';
export type {
  TableAction,
  TableBaseProps,
  TableColumn,
  TableFetchParameters,
  TableFilter,
  TableFilterMenuProps,
  TableFilterOption,
  TableSortDirection,
} from './TableBase.types';
