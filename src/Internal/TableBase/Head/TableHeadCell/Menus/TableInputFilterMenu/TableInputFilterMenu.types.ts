import type { TableFilterMenuProps } from '../../../../TableBase.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableInputFilterMenuProps = SncComponent<
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
     * @default `Start typing {title}`
     */
    placeholder?: string;
    /**
     * Renders the clear control.
     * @default true
     */
    isClearable?: boolean;
  }
>;
