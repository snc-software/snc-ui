import { cn } from '@/Utils/cn';

export const classes = {
  root: cn('snc:grid snc:gap-4'),
  loading: cn('snc:flex snc:items-center snc:justify-center snc:py-8'),
  empty: cn(
    'snc:flex snc:items-center snc:justify-center snc:py-8 snc:font-snc-body snc:text-sm snc:text-snc-text-secondary',
  ),
} as const;
