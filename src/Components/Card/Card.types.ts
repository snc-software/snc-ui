import type { Variants } from './Card.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export type CardProps = SncComponent<
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'style' | 'children' | 'content'> & {
    /**
     * Rendered in the bordered header region when supplied.
     */
    header?: ReactNode;
    /**
     * Rendered in the body region when supplied.
     */
    content?: ReactNode;
    /**
     * Rendered in the bordered actions region when supplied.
     */
    actions?: ReactNode;
    /**
     * Alignment of the `actions` row. Only meaningful when `actions` is supplied.
     * @default 'right'
     */
    actionsAlign?: keyof typeof Variants;
    ref?: Ref<HTMLDivElement>;
  }
>;
