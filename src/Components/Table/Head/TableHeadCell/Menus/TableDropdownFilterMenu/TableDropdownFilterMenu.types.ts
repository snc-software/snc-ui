import type { TableFilterMenuProps, TableFilterOption } from '../../../../Table.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableDropdownFilterMenuProps = SncComponent<
  TableFilterMenuProps & {
    /**
     * Id of the column being filtered. Becomes the filter's `id`.
     */
    columnId: string;
    /**
     * Column title, shown on the resulting filter chip.
     */
    title: string;
    /**
     * Options offered by the filter.
     */
    options: TableFilterOption[];
    /**
     * Renders the "clear selection" option.
     * @default true
     */
    isClearable?: boolean;
  }
>;
