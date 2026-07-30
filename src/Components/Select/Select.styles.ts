import { cn } from '@/Utils/cn';

export const classes = {
  wrapper: cn('snc:relative snc:inline-flex snc:items-center'),
  select: cn(
    'snc:w-full snc:appearance-none',
    'snc:rounded-md snc:border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:font-snc-body',
    'snc:transition-colors snc:duration-150',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  // Native selects cannot style their own arrow, so appearance-none removes it and this sits on top.
  chevron: cn(
    'snc:pointer-events-none snc:absolute snc:right-2',
    'snc:flex snc:items-center',
    'snc:text-snc-text-secondary',
  ),
} as const;
