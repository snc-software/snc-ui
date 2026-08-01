import type { Variants } from './Separator.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, Ref } from 'react';

export type SeparatorProps = SncComponent<
  Omit<HTMLAttributes<HTMLHRElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Direction the line runs. `vertical` also sets `aria-orientation="vertical"`, and is intended
     * for use inside a flex row container since a vertical line has no intrinsic height. Defaults to
     * `horizontal`.
     */
    orientation?: keyof typeof Variants;
    ref?: Ref<HTMLHRElement>;
  }
>;
