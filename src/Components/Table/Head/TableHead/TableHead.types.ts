import type { TableColumn, TableFilter, TableSortDirection } from '../../Table.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableHeadProps<TRow extends object> = SncComponent<{
  columns: Array<TableColumn<TRow>>;
  /**
   * Rows currently on screen. Needed here (rather than only in the body) to derive the select-all
   * checkbox state.
   */
  data?: Array<TRow>;
  filters: TableFilter[];
  isSelectionEnabled?: boolean;
  selectedRows?: Array<TRow>;
  isRowSelectable?: (row: TRow) => boolean;
  onSelectAllClicked: () => void;
  sortBy?: string;
  sortDirection?: TableSortDirection;
  onSortChanged: (columnId: string, sortDirection: TableSortDirection | undefined) => void;
  onFiltersSet: (filters: TableFilter[]) => void;
  onFiltersCleared: (filterIds: string[]) => void;
}>;
