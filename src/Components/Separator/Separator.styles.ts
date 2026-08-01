import { cn } from '@/Utils/cn';

/**
 * A native `<hr>` has a default browser border on all sides, so it's reset to `border-0` before the
 * orientation variant adds a single border. `shrink-0` stops a flex-row parent from squashing a
 * vertical line's width down to nothing.
 */
export const classes = {
  base: cn('snc:border-0 snc:border-snc-border snc:shrink-0'),
} as const;
