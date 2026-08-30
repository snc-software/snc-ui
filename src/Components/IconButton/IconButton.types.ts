import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { ButtonHTMLAttributes, ReactElement, Ref } from 'react';

export type IconButtonProps = SncComponentWithChildren<
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'id' | 'style' | 'children' | 'type'
  > & {
    /**
     * The icon to render inside the button.
     */
    children: ReactElement;
    /**
     * Accessible name, applied as both `aria-label` and `title` (icon-only button — no visible
     * text). Overridden by an explicit `aria-label`.
     */
    label: string;
    /**
     * Accepted as a normal prop so the root button can be referenced directly.
     */
    ref?: Ref<HTMLButtonElement>;
  }
>;
