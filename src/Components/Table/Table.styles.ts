import { cn } from '@/Utils/cn';

/**
 * `Table`'s own layout only. The cell, surface, scroll-area and table treatments are shared with every
 * other table layout and live in `@/Internal/TableBase`'s `classes`.
 */
export const classes = {
  root: cn('snc:flex snc:w-full snc:flex-col snc:gap-y-2'),
} as const;
