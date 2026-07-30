import { cn } from '@/Utils/cn';

export const Variants = {
  default: cn('snc:border-snc-border', 'snc:focus-visible:ring-snc-accent'),
  error: cn(
    'snc:border-snc-error-border snc:text-snc-error-text',
    'snc:focus-visible:ring-snc-error-border',
  ),
} as const;

export const Sizes = {
  sm: cn('snc:h-8 snc:py-1 snc:pl-2 snc:pr-8 snc:text-sm'),
  md: cn('snc:h-10 snc:py-2 snc:pl-3 snc:pr-9 snc:text-sm'),
} as const;
