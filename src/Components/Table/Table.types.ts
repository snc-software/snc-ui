import type { TableBaseProps } from '@/Internal/TableBase';
import type { SncComponent } from '@/Types/SncComponent';

// The vocabulary a consumer needs to configure a table is defined once, alongside the parts that
// consume it, and surfaced from here so `@/Components/Table` remains the only place it's imported from.
export type {
  TableAction,
  TableColumn,
  TableFetchParameters,
  TableFilter,
  TableFilterMenuProps,
  TableFilterOption,
  TableSortDirection,
} from '@/Internal/TableBase';

/**
 * A plain data table: toolbar, optional filter chips, the grid, and pagination, stacked full width.
 *
 * Everything describing the *data* comes from `TableBaseProps`, which `MasterDetailsTable` builds on
 * too — only the props below are specific to this layout.
 */
export type TableProps<TRow extends object> = SncComponent<
  TableBaseProps<TRow> & {
    /**
     * Supplying this makes rows clickable and adds the hover affordance.
     */
    onRowClicked?: (row: TRow) => void;
  }
>;
