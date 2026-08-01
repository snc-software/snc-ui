import { cn } from '@/Utils/cn';

export const Sizes = {
  sm: cn('snc:h-6 snc:w-6 snc:text-xs'),
  md: cn('snc:h-8 snc:w-8 snc:text-sm'),
  lg: cn('snc:h-10 snc:w-10 snc:text-base'),
} as const;

// Mode-aware bg/text pairs drawn from the design system's existing "subtle background" token
// pairs (primary/accent) plus the semantic status triads — the full set of qualitative colour
// pairs the token set defines, rather than an invented palette.
export const Palette = [
  cn('snc:bg-snc-primary-subtle-bg snc:text-snc-primary'),
  cn('snc:bg-snc-accent-subtle-bg snc:text-snc-accent'),
  cn('snc:bg-snc-success-bg snc:text-snc-success-text'),
  cn('snc:bg-snc-warning-bg snc:text-snc-warning-text'),
  cn('snc:bg-snc-error-bg snc:text-snc-error-text'),
  cn('snc:bg-snc-info-bg snc:text-snc-info-text'),
] as const;
