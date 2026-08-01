import type { Variants } from './Button.constants';
import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { ButtonHTMLAttributes, ReactElement, Ref } from 'react';

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
    /**
     * Decorative icon rendered alongside the button's label. Hidden from assistive tech
     * (the label already names the button) and suppressed while `isLoading` is `true`,
     * since the Spinner takes its place.
     */
    icon?: ReactElement;
    /**
     * Where `icon` renders relative to `children`. Defaults to `leading`.
     */
    iconPosition?: 'leading' | 'trailing';
    ref?: Ref<HTMLButtonElement>;
  }
>;
