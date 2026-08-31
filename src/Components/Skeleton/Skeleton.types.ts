import type { Variants } from './Skeleton.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, Ref } from 'react';

export type SkeletonProps = SncComponent<
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Placeholder shape. `text` mimics a line of body copy, `circle` mimics an avatar/icon, `rect`
     * mimics a block of content (image, chart, card body). Each sets its own default size and
     * border-radius; override sizing via `className`/`style`. Defaults to `text`.
     */
    shape?: keyof typeof Variants;
    ref?: Ref<HTMLDivElement>;
  }
>;
