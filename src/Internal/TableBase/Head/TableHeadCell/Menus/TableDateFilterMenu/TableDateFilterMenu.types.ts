import type { TableFilterMenuProps } from '../../../../TableBase.types';
import type { SncComponent } from '@/Types/SncComponent';

export type TableDateFilterMenuProps = SncComponent<
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
     * @default 'Select date'
     */
    placeholder?: string;
    /**
     * Renders the clear control.
     * @default true
     */
    isClearable?: boolean;
    /**
     * Which edge of the picker's calendar panel lines up with the trigger's matching edge.
     * @default 'left'
     */
    align?: 'left' | 'right';
  }
>;
