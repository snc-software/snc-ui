import type { TableColumn } from '../../Table.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableBodyRowProps<TRow extends object> = SncComponent<{
  columns: Array<TableColumn<TRow>>;
  /**
   * The row this `<tr>` renders.
   */
  row: TRow;
  /**
   * Index within the current page, used only to build stable test ids.
   */
  rowIndex: number;
  isSelectionEnabled?: boolean;
  isSelected?: boolean;
  /**
   * Whether this row may be selected at all. A non-selectable row renders a disabled checkbox.
   */
  isSelectable?: boolean;
  onRowClicked?: (row: TRow) => void;
  onSelectChanged?: (row: TRow, isSelected: boolean) => void;
}>;
