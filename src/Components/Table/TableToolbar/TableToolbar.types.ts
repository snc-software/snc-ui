import type { TableAction } from '../Table.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableToolbarProps<TRow extends object> = SncComponent<{
  /**
   * Number of rows currently rendered, used for the "showing x - y of z" caption.
   */
  dataLength: number;
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  isPaginated?: boolean;
  actions?: TableAction[];
  onActionClicked?: (actionId: string) => void;
  hideActionsWhenRowsSelected?: boolean;
  selected?: Array<TRow>;
  selectionActions?: TableAction[];
  onSelectionActionClicked?: (actionId: string, selected: Array<TRow>) => void;
  onSelectionCleared: () => void;
  onPageSizeChanged: (pageSize: number) => void;
}>;
