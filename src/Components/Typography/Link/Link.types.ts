import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { AnchorHTMLAttributes, Ref } from 'react';

export type LinkProps = SncComponentWithChildren<
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'className' | 'id' | 'style' | 'children' | 'href'
  > & {
    /**
     * Destination URL. Required — a Link with no destination isn't a meaningful use of this component.
     */
    href: string;
    ref?: Ref<HTMLAnchorElement>;
  }
>;
