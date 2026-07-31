import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export type TagProps = SncComponentWithChildren<
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * The tag's label text.
     */
    children: ReactNode;
    ref?: Ref<HTMLSpanElement>;
  }
>;
