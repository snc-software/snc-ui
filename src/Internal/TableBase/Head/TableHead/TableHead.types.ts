import type { TableColumn, TableSortDirection } from '../../TableBase.types';
import type { TableStore } from '@/States/useTableState';
import type { SncComponent } from '@/Types/SncComponent';

export type TableHeadProps<TRow extends object> = SncComponent<{
  store: TableStore<TRow>;
  columns: Array<TableColumn<TRow>>;
  /**
   * Rows currently on screen. Needed here (rather than only in the body) to derive the select-all
   * checkbox state.
   */
  data?: Array<TRow>;
  isSelectionEnabled?: boolean;
  isRowSelectable?: (row: TRow) => boolean;
  sortBy?: string;
  sortDirection?: TableSortDirection;
  onSortChanged: (columnId: string, sortDirection: TableSortDirection | undefined) => void;
}>;
