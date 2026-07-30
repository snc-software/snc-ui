import type { Sizes } from './Heading.constants';
import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { HTMLAttributes, Ref } from 'react';

export type HeadingProps = SncComponentWithChildren<
  Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Semantic heading level. Drives both the rendered tag (`<h1>`-`<h6>`) and its visual size.
     */
    level?: keyof typeof Sizes;
    ref?: Ref<HTMLHeadingElement>;
  }
>;
