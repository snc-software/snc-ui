import { cn } from '@/Utils/cn';

export const classes = {
  button: cn(
    'snc:inline-flex snc:items-center snc:justify-center',
    'snc:rounded-full snc:p-2',
    'snc:text-snc-text-secondary',
    'snc:transition-colors snc:duration-200',
    'snc:hover:bg-snc-surface-accent',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
} as const;
