import { cn } from '@/Utils/cn';

export const Variants = {
  default: cn(
    'snc:border-snc-border',
    'snc:checked:border-snc-primary snc:checked:bg-snc-primary',
    'snc:indeterminate:border-snc-primary snc:indeterminate:bg-snc-primary',
    'snc:focus-visible:ring-snc-primary',
  ),
  error: cn(
    'snc:border-snc-error-border',
    'snc:checked:border-snc-error-border snc:checked:bg-snc-error-border',
    'snc:indeterminate:border-snc-error-border snc:indeterminate:bg-snc-error-border',
    'snc:focus-visible:ring-snc-error-border',
  ),
} as const;
