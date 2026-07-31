import type { TableColumn } from '../../Table.types';
import type { TableStore } from '@/States/useTableState';
import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

export type TableBodyProps<TRow extends object> = SncComponent<{
  store: TableStore<TRow>;
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
  isRowSelectable?: (row: TRow) => boolean;
  onRowClicked?: (row: TRow) => void;
}>;
