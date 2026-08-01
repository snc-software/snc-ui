import { cn } from '@/Utils/cn';

export const classes = {
  base: cn(
    'snc:inline-flex snc:items-center snc:justify-center snc:gap-2',
    'snc:rounded-md snc:border snc:border-transparent',
    'snc:px-4 snc:py-2 snc:font-snc-body snc:text-sm snc:font-medium',
    'snc:transition-colors snc:duration-150',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  icon: cn('snc:inline-flex snc:shrink-0 snc:items-center'),
} as const;
