import type { Sizes } from './Spinner.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, Ref } from 'react';

export type SpinnerProps = SncComponent<
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Diameter of the spinner. Defaults to `md`.
     */
    size?: keyof typeof Sizes;
    /**
     * Visually hidden text announcing what is loading. Rendered inside the `status` live region, so
     * screen readers read it when the spinner appears. Defaults to `Loading`.
     */
    label?: string;
    ref?: Ref<HTMLSpanElement>;
  }
>;
