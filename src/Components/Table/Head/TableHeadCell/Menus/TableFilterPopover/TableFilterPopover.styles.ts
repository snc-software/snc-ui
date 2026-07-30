import { cn } from '@/Utils/cn';

export const classes = {
  panel: cn(
    'snc:fixed snc:z-50',
    'snc:min-w-min',
    'snc:rounded-b-md snc:border snc:border-snc-border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:shadow-lg',
  ),
} as const;
