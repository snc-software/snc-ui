import { cn } from '@/Utils/cn';

export const classes = {
  cell: cn(
    'snc:bg-snc-surface-accent snc:text-snc-text-primary',
    'snc:border-t-0 snc:text-left snc:font-normal',
  ),
  content: cn('snc:flex snc:items-center snc:gap-2'),
  title: cn('snc:flex snc:flex-1 snc:items-center snc:text-left snc:text-sm'),
  titleText: cn('snc:w-full snc:flex-1 snc:font-medium'),
  control: cn(
    'snc:inline-flex snc:items-center snc:justify-center',
    'snc:rounded snc:p-0 snc:text-snc-text-secondary',
    'snc:transition-colors snc:duration-150',
    'snc:hover:text-snc-text-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-accent',
  ),
  filterTrigger: cn('snc:flex snc:flex-1 snc:items-center snc:gap-2 snc:text-left'),
  filterIcon: cn('snc:transition-transform snc:duration-300'),
} as const;
