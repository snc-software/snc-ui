import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:inline-flex snc:items-center snc:justify-center'),
  svg: cn('snc:animate-spin'),
  track: cn('snc:opacity-25'),
  head: cn('snc:opacity-75'),
} as const;
