import { cn } from '@/Utils/cn';

/**
 * Same bordered-surface treatment `Modal`'s and `Accordion`'s root already use.
 */
export const classes = {
  root: cn(
    'snc:w-full snc:overflow-hidden',
    'snc:rounded-xl snc:border snc:border-snc-border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
  ),
  progressList: cn('snc:flex snc:list-none snc:items-center snc:gap-2 snc:px-4 snc:py-4 snc:m-0'),
  progressItem: cn('snc:flex snc:flex-1 snc:items-center snc:gap-2 snc:last:flex-none'),
  marker: cn(
    'snc:flex snc:size-8 snc:shrink-0 snc:items-center snc:justify-center',
    'snc:rounded-full snc:border snc:font-snc-body snc:text-sm snc:font-medium',
  ),
  markerUpcoming: cn('snc:border-snc-border snc:text-snc-text-secondary'),
  markerCurrent: cn('snc:border-snc-primary snc:bg-snc-primary snc:text-snc-surface'),
  markerCompleted: cn(
    'snc:border-snc-primary-subtle-bg snc:bg-snc-primary-subtle-bg snc:text-snc-primary',
  ),
  markerLabel: cn('snc:sr-only'),
  progressConnector: cn('snc:h-px snc:flex-1 snc:bg-snc-border'),
  content: cn('snc:px-4 snc:pt-2 snc:pb-4', 'snc:font-snc-body snc:text-sm'),
  divider: cn('snc:h-px snc:w-full snc:bg-snc-border'),
  footer: cn('snc:flex snc:items-center snc:justify-between snc:gap-2 snc:px-4 snc:py-3'),
  actionGroup: cn('snc:flex snc:items-center snc:gap-2'),
} as const;
