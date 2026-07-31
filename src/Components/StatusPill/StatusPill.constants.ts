import { cn } from '@/Utils/cn';

export const Variants = {
  info: cn('snc:bg-snc-info-bg snc:border-snc-info-border snc:text-snc-info-text'),
  warning: cn('snc:bg-snc-warning-bg snc:border-snc-warning-border snc:text-snc-warning-text'),
  error: cn('snc:bg-snc-error-bg snc:border-snc-error-border snc:text-snc-error-text'),
  success: cn('snc:bg-snc-success-bg snc:border-snc-success-border snc:text-snc-success-text'),
} as const;
