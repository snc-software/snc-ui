import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:flex snc:items-center snc:gap-2 snc:p-4'),
  jumpGroup: cn('snc:flex snc:w-12 snc:gap-2'),
  control: cn(
    'snc:inline-flex snc:h-8 snc:w-8 snc:items-center snc:justify-center',
    'snc:rounded snc:font-snc-body snc:text-sm',
    'snc:text-snc-text-secondary',
    'snc:transition-colors snc:duration-150',
    'snc:hover:bg-snc-accent-subtle-bg snc:hover:text-snc-text-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
  pageCurrent: cn(
    'snc:bg-snc-primary snc:text-snc-surface snc:font-medium',
    'snc:hover:bg-snc-primary-hover snc:hover:text-snc-surface',
  ),
} as const;
