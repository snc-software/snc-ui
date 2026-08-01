import type { Sizes } from './Avatar.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, Ref } from 'react';

export type AvatarProps = SncComponent<
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'id' | 'style' | 'children'> & {
    /** Falls back to initials when omitted, or if the image fails to load. */
    src?: string;
    name: string;
    /** @default 'md' */
    size?: keyof typeof Sizes;
    ref?: Ref<HTMLSpanElement>;
  }
>;
