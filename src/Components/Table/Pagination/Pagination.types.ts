import type { TableStore } from '@/States/useTableState';
import type { SncComponent } from '@/Types/SncComponent';

export type PaginationProps<TRow extends object> = SncComponent<{
  store: TableStore<TRow>;
  /**
   * Total rows across the dataset, not just the current page.
   */
  total: number;
  /**
   * Page numbers shown either side of the current page.
   * @default 2
   */
  size?: number;
}>;
