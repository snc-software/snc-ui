import { cn } from '@/Utils/cn';

export const classes = {
  container: cn(
    'snc:rounded-lg snc:border snc:border-snc-border snc:bg-snc-surface snc:px-3 snc:py-2 snc:font-snc-body snc:text-sm snc:shadow-md',
  ),
  label: cn('snc:mb-1 snc:font-medium snc:text-snc-text-primary'),
  list: cn('snc:flex snc:flex-col snc:gap-y-1'),
  item: cn('snc:flex snc:items-center snc:gap-x-2'),
  swatch: cn('snc:h-2.5 snc:w-2.5 snc:shrink-0 snc:rounded-full'),
  itemLabel: cn('snc:text-snc-text-secondary'),
  itemValue: cn('snc:font-medium snc:text-snc-text-primary'),
} as const;
