import type { TableColumn } from '../../Table.types';
import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

export type TableBodyProps<TRow extends object> = SncComponent<{
  columns: Array<TableColumn<TRow>>;
  data?: Array<TRow>;
  /**
   * Replaces the rows with a centred spinner.
   */
  isLoading?: boolean;
  /**
   * Shown in place of the rows when `data` is empty and not loading.
   */
  emptyMessage?: ReactNode;
  isSelectionEnabled?: boolean;
  selectedRows?: Array<TRow>;
  isRowSelectable?: (row: TRow) => boolean;
  onRowClicked?: (row: TRow) => void;
  onRowSelectChanged?: (row: TRow, isSelected: boolean) => void;
}>;
