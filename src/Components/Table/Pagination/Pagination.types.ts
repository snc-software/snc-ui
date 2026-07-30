import type { SncComponent } from '@/Types/SncComponent';

export type PaginationProps = SncComponent<{
  /**
   * Current page, 1-based.
   */
  page: number;
  pageSize: number;
  /**
   * Total rows across the dataset, not just the current page.
   */
  total: number;
  /**
   * Page numbers shown either side of the current page.
   * @default 2
   */
  size?: number;
  onChange: (page: number) => void;
}>;
