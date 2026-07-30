import type { Variants } from './Button.constants';
import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { ButtonHTMLAttributes, Ref } from 'react';

export type ButtonProps = SncComponentWithChildren<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Visual style of the button. Defaults to `primary`.
     */
    variant?: keyof typeof Variants;
    /**
     * Shows a spinner and forces the button into a disabled, `aria-busy` state while `true`.
     */
    isLoading?: boolean;
    ref?: Ref<HTMLButtonElement>;
  }
>;
