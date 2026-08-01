import { cn } from '@/Utils/cn';

export const classes = {
  base: cn(
    'snc:flex snc:min-h-16 snc:min-w-max snc:items-center snc:gap-4',
    'snc:rounded-md snc:border snc:border-snc-border snc:bg-snc-surface',
    'snc:p-3',
  ),
  divider: cn('snc:h-8 snc:border-l snc:border-snc-border'),
  caption: cn('snc:min-w-max snc:font-snc-body snc:text-sm snc:text-snc-text-secondary'),
  captionGrows: cn('snc:flex snc:flex-1'),
  actionGroup: cn('snc:flex snc:min-w-max snc:gap-2'),
  pageSize: cn('snc:flex-1'),
  clearSelection: cn('snc:flex snc:min-w-max snc:items-center snc:justify-center snc:gap-1'),
} as const;
