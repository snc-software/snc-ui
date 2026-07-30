import { cn } from '@/Utils/cn';

export const classes = {
  selectionCell: cn(
    'snc:w-10 snc:bg-snc-surface-accent',
    'snc:border-l-0 snc:border-t-0 snc:font-normal',
  ),
  // Trims the outer edges so the grid's border sits flush with the surrounding rounded container.
  firstColumn: cn('snc:border-l-0'),
  lastColumn: cn('snc:border-r-0'),
} as const;
