import type { TableColumn, TableFilter, TableSortDirection } from '../../Table.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableHeadCellProps<TRow extends object> = SncComponent<{
  /**
   * Column this cell renders the header for.
   */
  column: TableColumn<TRow>;
  /**
   * Filters currently active across the table.
   */
  filters: TableFilter[];
  /**
   * Current sort direction for this column, or `undefined` when another column (or none) is sorted.
   */
  sortDirection?: TableSortDirection;
  /**
   * Supplied only when the column is sortable — its presence is what renders the sort control.
   */
  onSortChanged?: (columnId: string, sortDirection: TableSortDirection | undefined) => void;
  onFiltersSet: (filters: TableFilter[]) => void;
  onFiltersCleared: (filterIds: string[]) => void;
}>;
