export { default } from './Table';

export type {
  TableAction,
  TableColumn,
  TableFetchParameters,
  TableFilter,
  TableFilterMenuProps,
  TableFilterOption,
  TableProps,
  TableSortDirection,
} from './Table.types';

// Compound sub-components — re-exported so consumers can compose a bespoke table, per
// component-standards.md. They are only meaningful inside a Table.
export { default as TableHead } from './Head/TableHead';
export type { TableHeadProps } from './Head/TableHead';
export { default as TableHeadRow } from './Head/TableHeadRow';
export type { TableHeadRowProps } from './Head/TableHeadRow';
export { default as TableHeadCell } from './Head/TableHeadCell';
export type { TableHeadCellProps } from './Head/TableHeadCell';

export { default as TableInputFilterMenu } from './Head/TableHeadCell/Menus/TableInputFilterMenu';
export type { TableInputFilterMenuProps } from './Head/TableHeadCell/Menus/TableInputFilterMenu';
export { default as TableDropdownFilterMenu } from './Head/TableHeadCell/Menus/TableDropdownFilterMenu';
export type { TableDropdownFilterMenuProps } from './Head/TableHeadCell/Menus/TableDropdownFilterMenu';

export { default as TableBody } from './Body/TableBody';
export type { TableBodyProps } from './Body/TableBody';
export { default as TableBodyRow } from './Body/TableBodyRow';
export type { TableBodyRowProps } from './Body/TableBodyRow';
export { default as TableBodyCell } from './Body/TableBodyCell';
export type { TableBodyCellProps } from './Body/TableBodyCell';

export { default as TableFilterChip } from './Filters/TableFilterChip';
export type { TableFilterChipProps } from './Filters/TableFilterChip';
export { default as TableFilterPanel } from './Filters/TableFilterPanel';
export type { TableFilterPanelProps } from './Filters/TableFilterPanel';

export { default as Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';
export { default as PageSizeSelector } from './PageSizeSelector';
export type { PageSizeSelectorProps } from './PageSizeSelector';
export { default as TableToolbar } from './TableToolbar';
export type { TableToolbarProps } from './TableToolbar';
