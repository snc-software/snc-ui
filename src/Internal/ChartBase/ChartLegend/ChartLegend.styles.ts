import { cn } from '@/Utils/cn';

export const classes = {
  list: cn(
    'snc:flex snc:w-full snc:flex-wrap snc:items-center snc:justify-center snc:gap-x-4 snc:gap-y-2 snc:pt-2 snc:font-snc-body snc:text-sm',
  ),
  item: cn('snc:flex snc:items-center snc:gap-x-1.5'),
  swatch: cn('snc:h-2.5 snc:w-2.5 snc:shrink-0 snc:rounded-full'),
  label: cn('snc:text-snc-text-secondary'),
} as const;
