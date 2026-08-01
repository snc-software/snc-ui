import type {
  TableAction,
  TableFilter,
  TableFetchParameters,
  TableSortDirection,
} from '@/Internal/TableBase';
import type { TableStore } from '@/States/useTableState';

/**
 * The subset of a table's props that drives behaviour rather than layout. Each layout component
 * passes its own props straight through, so the two stay in step by construction.
 */
export type UseTableControllerOptions<TRow extends object> = {
  filters: TableFilter[];
  onFetchRequested: (fetchParameters: TableFetchParameters) => void;
  initialPageSize?: number;
  pageSizeOptions: number[];
  getSelectionActions?: (selected: TRow[]) => TableAction[];
  onSelectionActionClicked?: (actionId: string, selected: Array<TRow>) => void;
  actions: TableAction[];
  isPaginated: boolean;
};

export type UseTableControllerResult<TRow extends object> = {
  /**
   * Passed to every part that needs to read or write table state.
   */
  store: TableStore<TRow>;
  activeFilters: TableFilter[];
  sortBy?: string;
  sortDirection?: TableSortDirection;
  /**
   * Selection actions for the current selection. A non-empty array is what enables the selection
   * column.
   */
  selectionActions: TableAction[];
  isSelectionEnabled: boolean;
  /**
   * Whether the toolbar has anything to show — no actions, no selection and no pagination means no
   * toolbar.
   */
  isToolbarVisible: boolean;
  onSortChanged: (columnId: string, sortDirection: TableSortDirection | undefined) => void;
  /**
   * Runs the consumer's handler, then clears the selection.
   */
  onSelectionActionClicked: (actionId: string, selected: Array<TRow>) => void;
};
