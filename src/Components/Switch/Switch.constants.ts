import { cn } from '@/Utils/cn';

export const Variants = {
  default: cn(
    'snc:border-snc-neutral-400 snc:bg-snc-neutral-400',
    'snc:checked:border-snc-primary snc:checked:bg-snc-primary',
    'snc:focus-visible:ring-snc-primary',
  ),
  error: cn(
    'snc:border-snc-error-border snc:bg-snc-neutral-400',
    'snc:checked:border-snc-error-border snc:checked:bg-snc-error-border',
    'snc:focus-visible:ring-snc-error-border',
  ),
} as const;
