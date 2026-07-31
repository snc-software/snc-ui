import { cn } from '@/Utils/cn';

export const Variants = {
  default: cn('snc:border-snc-border', 'snc:focus-visible:ring-snc-primary'),
  error: cn(
    'snc:border-snc-error-border snc:text-snc-error-text',
    'snc:focus-visible:ring-snc-error-border',
  ),
} as const;

export const DefaultPlaceholder = 'Select date';

export const IconSize = 16;
