import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { HTMLAttributes, Ref } from 'react';

export type ParagraphProps = SncComponentWithChildren<
  Omit<HTMLAttributes<HTMLParagraphElement>, 'className' | 'id' | 'style' | 'children'> & {
    ref?: Ref<HTMLParagraphElement>;
  }
>;
