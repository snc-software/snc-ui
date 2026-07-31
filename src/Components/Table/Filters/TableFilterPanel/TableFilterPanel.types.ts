import type { TableFilter } from '../../Table.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableFilterPanelProps = SncComponent<{
  /**
   * Filters currently applied to the table.
   */
  filters: TableFilter[];
  /**
   * Removes the filter with the supplied id.
   */
  onFilterCleared: (filterId: string) => void;
  /**
   * Removes every filter.
   */
  onAllFiltersCleared: () => void;
}>;
