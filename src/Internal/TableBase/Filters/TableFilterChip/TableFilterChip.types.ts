import type { SncComponent } from '@/Types/SncComponent';

export type TableFilterChipProps = SncComponent<{
  /**
   * User-friendly name of the column being filtered.
   */
  title: string;
  /**
   * User-friendly rendering of the filter value.
   */
  value: string;
  onClear: () => void;
}>;
