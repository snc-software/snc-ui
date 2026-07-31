import type { TableColumn, TableSortDirection } from '../../Table.types';
import type { TableSelectionState } from '../../Table.utils';
import type { TableStore } from '@/States/useTableState';
import type { SncComponent } from '@/Types/SncComponent';

export type TableHeadRowProps<TRow extends object> = SncComponent<{
  store: TableStore<TRow>;
  columns: Array<TableColumn<TRow>>;
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
}>;
