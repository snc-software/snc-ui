import type { Variants } from './StatusPill.constants';
import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export type StatusPillProps = SncComponentWithChildren<
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Semantic status the pill communicates. No default: every usage must state which status it
     * represents.
     */
    variant: keyof typeof Variants;
    /**
     * The pill's label text.
     */
    children: ReactNode;
    ref?: Ref<HTMLSpanElement>;
  }
>;
