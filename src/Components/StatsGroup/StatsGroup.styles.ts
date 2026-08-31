import { cn } from '@/Utils/cn';

export const classes = {
  root: cn('snc:grid snc:gap-4'),
  empty: cn(
    'snc:flex snc:items-center snc:justify-center snc:py-8 snc:font-snc-body snc:text-sm snc:text-snc-text-secondary',
  ),
  loadingCardHeader: cn('snc:flex snc:items-start snc:justify-between snc:gap-2'),
  loadingCardLabel: cn('snc:h-3 snc:w-20'),
  loadingCardIcon: cn('snc:h-8 snc:w-8 snc:shrink-0'),
  loadingCardValue: cn('snc:mt-1 snc:h-6 snc:w-16'),
} as const;
