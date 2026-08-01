import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { LabelHTMLAttributes, Ref } from 'react';

export type InputLabelProps = SncComponentWithChildren<
  Omit<LabelHTMLAttributes<HTMLLabelElement>, 'className' | 'id' | 'style' | 'children'> & {
    ref?: Ref<HTMLLabelElement>;
  }
>;
