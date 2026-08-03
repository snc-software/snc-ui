import { cn } from '@/Utils/cn';

export const classes = {
  header: cn('snc:flex snc:items-start snc:justify-between snc:gap-2'),
  label: cn('snc:text-snc-text-secondary'),
  value: cn('snc:mt-1'),
  icon: cn(
    'snc:inline-flex snc:h-8 snc:w-8 snc:shrink-0 snc:items-center snc:justify-center',
    'snc:rounded-lg',
  ),
  metricRow: cn('snc:flex'),
  trend: cn('snc:mt-2 snc:flex snc:items-center snc:gap-1 snc:text-sm'),
  trendIcon: cn('snc:inline-flex snc:shrink-0 snc:items-center'),
  trendValue: cn('snc:font-medium'),
  sparklineWrapper: cn('snc:mt-2'),
} as const;
