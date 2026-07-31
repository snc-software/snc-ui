import type { TableColumn, TableSortDirection } from '../../Table.types';
import type { TableStore } from '@/States/useTableState';
import type { SncComponent } from '@/Types/SncComponent';

export type TableHeadCellProps<TRow extends object> = SncComponent<{
  store: TableStore<TRow>;
  /**
   * Column this cell renders the header for.
   */
  column: TableColumn<TRow>;
  /**
   * Current sort direction for this column, or `undefined` when another column (or none) is sorted.
   */
  sortDirection?: TableSortDirection;
  /**
   * Supplied only when the column is sortable — its presence is what renders the sort control.
   */
  onSortChanged?: (columnId: string, sortDirection: TableSortDirection | undefined) => void;
}>;
