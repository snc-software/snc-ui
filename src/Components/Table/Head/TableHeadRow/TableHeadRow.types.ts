import type { TableColumn, TableFilter, TableSortDirection } from '../../Table.types';
import type { TableSelectionState } from '../../Table.utils';
import type { SncComponent } from '@/Types/SncComponent';

export type TableHeadRowProps<TRow extends object> = SncComponent<{
  columns: Array<TableColumn<TRow>>;
  filters: TableFilter[];
  /**
   * Renders the leading select-all cell.
   */
  isSelectionEnabled?: boolean;
  /**
   * Checked/indeterminate state for the select-all checkbox.
   */
  selectionState: TableSelectionState;
  onSelectAllClicked: () => void;
  /**
   * Id of the column currently sorted, if any.
   */
  sortBy?: string;
  sortDirection?: TableSortDirection;
  onSortChanged: (columnId: string, sortDirection: TableSortDirection | undefined) => void;
  onFiltersSet: (filters: TableFilter[]) => void;
  onFiltersCleared: (filterIds: string[]) => void;
}>;
