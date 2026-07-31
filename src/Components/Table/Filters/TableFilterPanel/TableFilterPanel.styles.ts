import { cn } from '@/Utils/cn';

export const classes = {
  base: cn(
    'snc:flex snc:w-full snc:items-center snc:gap-4',
    'snc:rounded-md snc:border snc:border-snc-border snc:bg-snc-surface',
    'snc:p-3',
  ),
  chips: cn('snc:flex snc:flex-1 snc:gap-2 snc:overflow-x-auto'),
  scrollControl: cn(
    'snc:inline-flex snc:shrink-0 snc:items-center snc:justify-center',
    'snc:rounded snc:p-0 snc:text-snc-text-secondary',
    'snc:transition-colors snc:duration-150 snc:hover:text-snc-text-primary',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-40',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
} as const;
