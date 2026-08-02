import { cn } from '@/Utils/cn';

export const classes = {
  label: cn(
    'snc:flex snc:w-full snc:cursor-pointer snc:items-center snc:gap-2',
    'snc:py-2 snc:pr-4',
    'snc:hover:bg-snc-primary-subtle-bg',
  ),
  interactive: cn(
    'snc:flex snc:w-full snc:items-center snc:gap-2',
    'snc:py-2 snc:pr-4 snc:text-left',
    'snc:hover:bg-snc-primary-subtle-bg',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-inset snc:focus-visible:ring-snc-primary',
  ),
  highlighted: cn('snc:bg-snc-primary-subtle-bg'),
  disabled: cn('snc:cursor-not-allowed snc:line-through snc:opacity-60 snc:hover:bg-transparent'),
  content: cn('snc:flex snc:min-w-0 snc:flex-1 snc:flex-col'),
  title: cn('snc:truncate snc:font-snc-body snc:text-sm snc:text-snc-text-primary'),
  titleSelected: cn('snc:font-semibold'),
  description: cn('snc:truncate snc:font-snc-body snc:text-xs snc:text-snc-text-secondary'),
} as const;
