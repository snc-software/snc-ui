import { cn } from '@/Utils/cn';

export const classes = {
  clickable: cn('snc:cursor-pointer snc:hover:bg-snc-accent-subtle-bg'),
  selected: cn('snc:bg-snc-primary-subtle-bg'),
  selectionCell: cn('snc:w-10 snc:border-l-0'),
  firstColumn: cn('snc:border-l-0'),
  lastColumn: cn('snc:border-r-0'),
} as const;
