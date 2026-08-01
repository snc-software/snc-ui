import { cn } from '@/Utils/cn';

export const classes = {
  root: cn('snc:flex snc:w-full snc:flex-col snc:items-center'),
  loading: cn('snc:flex snc:w-full snc:items-center snc:justify-center'),
  empty: cn(
    'snc:flex snc:w-full snc:items-center snc:justify-center snc:font-snc-body snc:text-sm snc:text-snc-text-secondary',
  ),
  axisTick: cn('snc:fill-snc-text-secondary snc:font-snc-body snc:text-xs'),
} as const;
