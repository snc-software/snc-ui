import type { ButtonProps } from '@/Components/Button';
import type { ReactNode } from 'react';

export type TableSortDirection = 'asc' | 'desc';

export type TableFilter<TValue = unknown> = {
  /**
   * Filter id. Typically the parameter name used when calling an API for table data, and always the
   * `id` of the column the filter belongs to.
   */
  id: string;
  /**
   * User-friendly identifier for the column being filtered on. Shown on the filter chip.
   */
  title: string;
  /**
   * User-friendly rendering of the value. Shown on the filter chip.
   */
  text?: string;
  /**
   * Filter value. Typically the parameter value used when calling an API for table data.
   */
  value?: TValue;
};

export type TableFetchParameters = {
  filters: TableFilter[];
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: TableSortDirection;
};

export type TableAction = {
  id: string;
  label: string;
  /**
   * Appearance of the action's button. Defaults to `primary` for the leading action and `secondary`
   * for the rest
   */
  variant?: ButtonProps['variant'];
  disabled?: boolean;
};

export type TableFilterOption = {
  value: string;
  label: string;
};

/**
 * Handed to a `custom` column's `menu` render prop so a consumer can build their own filter UI without
 * needing access to the table's internals.
 */
export type TableFilterMenuProps = {
  /**
   * Filters currently active across the whole table.
   */
  filters: TableFilter[];
  /**
   * Dismisses the popover.
   */
  onClose: () => void;
  /**
   * Applies (or replaces) the supplied filters.
   */
  onFiltersSet: (filters: TableFilter[]) => void;
  /**
   * Removes the filters with the supplied ids.
   */
  onFiltersCleared: (filterIds: string[]) => void;
};

type BaseTableColumn<TRow extends object, TValue = unknown> = {
  /**
   * Column id. Sent as `sortBy`, and used as the filter id, so it must match what the data source
   * expects.
   */
  id: string;
  /**
   * Header title.
   */
  title: string;
  /**
   * Reads this column's value out of a row.
   */
  accessor: (row: TRow) => TValue;
  /**
   * Renders custom cell content — typography, a status pill, or any other React node. Receives the
   * accessed value and the whole row, so a cell can render from fields beyond its own accessor.
   * Defaults to the value's string representation.
   */
  cell?: (value: TValue, row: TRow) => ReactNode;
  /**
   * Renders custom header content in place of the plain title.
   */
  header?: (title: string) => ReactNode;
  /**
   * Enables the sort control on this column's header cell.
   */
  isSortable?: boolean;
  /**
   * Fixed column width, in px.
   */
  width?: number;
};

type FilterableTableColumn<
  TRow extends object,
  TFilterType extends string,
  TValue = unknown,
> = BaseTableColumn<TRow, TValue> & {
  /**
   * Which filter control the header cell renders.
   */
  filterType: TFilterType;
  /**
   * Horizontal alignment of the filter popover against the header cell.
   * @default 'left'
   */
  alignMenu?: 'left' | 'right';
  /**
   * Matches the popover width to the header cell width.
   * @default true
   */
  hasAdaptiveWidth?: boolean;
  /**
   * Renders the menu's clear control.
   * @default true
   */
  isClearable?: boolean;
};

type UnfilterableTableColumn<TRow extends object, TValue = unknown> = BaseTableColumn<
  TRow,
  TValue
> & {
  filterType?: never;
};

type InputTableColumn<TRow extends object, TValue = unknown> = FilterableTableColumn<
  TRow,
  'input',
  TValue
> & {
  /**
   * @default `Start typing {title}`
   */
  placeholder?: string;
};

type DropdownTableColumn<TRow extends object, TValue = unknown> = FilterableTableColumn<
  TRow,
  'dropdown',
  TValue
> & {
  /**
   * Options offered by the dropdown filter.
   */
  options: TableFilterOption[];
};

type CustomTableColumn<TRow extends object, TValue = unknown> = FilterableTableColumn<
  TRow,
  'custom',
  TValue
> & {
  /**
   * Icon for the filter trigger. Receives whether the popover is currently open, so the icon can
   * reflect state (e.g. a rotating chevron).
   */
  filterIcon: (isOpen: boolean) => ReactNode;
  /**
   * Contents of the filter popover.
   */
  menu: (props: TableFilterMenuProps) => ReactNode;
};

export type TableColumn<TRow extends object, TValue = unknown> =
  | UnfilterableTableColumn<TRow, TValue>
  | InputTableColumn<TRow, TValue>
  | DropdownTableColumn<TRow, TValue>
  | CustomTableColumn<TRow, TValue>;

/**
 * The props that describe *a table of data*, independent of how that data is laid out. `Table` and
 * `MasterDetailsTable` each build their own props type on top of this one, so the half they share
 * stays in lockstep without either importing the other's props — and without one of them growing a
 * prop that only exists to serve the other.
 *
 * Deliberately excludes `className`/`id`/`style`/`data-*`: each component adds those itself via
 * `SncComponent`, so they land on that component's own root.
 */
export type TableBaseProps<TRow extends object> = {
  /**
   * Column definitions. Drives both the header and the body.
   */
  columns: Array<TableColumn<TRow>>;
  /**
   * Rows for the current page.
   * @default []
   */
  data?: Array<TRow>;
  /**
   * Total rows across the whole dataset — drives pagination, not `data.length`.
   */
  total: number;
  /**
   * Filters to pre-apply.
   * @default []
   */
  filters?: Array<TableFilter>;
  /**
   * Called whenever sort, filters, page or page size change. The consumer owns fetching.
   */
  onFetchRequested: (fetchParameters: TableFetchParameters) => void;
  /**
   * Replaces the rows with a loading indicator.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Conditionally enables selection per row. Rows returning `false` cannot be selected, and are
   * excluded from select-all.
   */
  isRowSelectable?: (row: TRow) => boolean;
  /**
   * Actions available only while rows are selected. Returning a non-empty array is what enables the
   * selection column.
   * @default () => []
   */
  getSelectionActions?: (selected: TRow[]) => TableAction[];
  onSelectionActionClicked?: (actionId: string, selected: Array<TRow>) => void;
  /**
   * Toolbar actions available regardless of selection.
   * @default []
   */
  actions?: TableAction[];
  onActionClicked?: (actionId: string) => void;
  /**
   * Hides `actions` while any row is selected, leaving only the selection actions.
   * @default false
   */
  hideActionsWhenRowsSelected?: boolean;
  /**
   * Shows the toolbar's page size selector and the pagination controls.
   * @default true
   */
  isPaginated?: boolean;
  /**
   * Initial page size. Ignored unless it appears in `pageSizeOptions`.
   */
  pageSize?: number;
  /**
   * @default [20, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * Shown in place of the rows when there is no data.
   * @default 'No data found'
   */
  emptyMessage?: ReactNode;
};
