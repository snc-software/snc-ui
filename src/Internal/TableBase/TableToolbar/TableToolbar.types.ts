import type { TableAction } from '../TableBase.types';
import type { TableStore } from '@/States/useTableState';
import type { SncComponent } from '@/Types/SncComponent';

export type TableToolbarProps<TRow extends object> = SncComponent<{
  store: TableStore<TRow>;
  /**
   * Number of rows currently rendered, used for the "showing x - y of z" caption.
   */
  dataLength: number;
  total: number;
  pageSizeOptions: readonly number[];
  isPaginated?: boolean;
  actions?: TableAction[];
  onActionClicked?: (actionId: string) => void;
  hideActionsWhenRowsSelected?: boolean;
  selectionActions?: TableAction[];
  onSelectionActionClicked?: (actionId: string, selected: Array<TRow>) => void;
}>;
