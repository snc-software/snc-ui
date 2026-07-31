import { cn } from '@/Utils/cn';

export const classes = {
  base: cn(
    'snc:block snc:w-full',
    'snc:rounded-md snc:border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:px-3 snc:py-2 snc:font-snc-body snc:text-sm',
    'snc:placeholder:text-snc-text-secondary',
    'snc:transition-colors snc:duration-150',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
} as const;
