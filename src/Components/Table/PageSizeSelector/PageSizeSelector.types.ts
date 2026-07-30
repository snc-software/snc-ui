import type { SncComponent } from '@/Types/SncComponent';

export type PageSizeSelectorProps = SncComponent<{
  /**
   * Currently selected page size.
   */
  value: number;
  /**
   * Sizes offered.
   */
  options: readonly number[];
  disabled?: boolean;
  onChange: (pageSize: number) => void;
}>;
