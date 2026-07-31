import { cn } from '@/Utils/cn';

/**
 * Used as a group heading alongside grouped options and filters — compact label shape shared
 * with `StatusPill`. Follows the design system's "Subtle backgrounds" pattern (primarySubtleBg
 * rather than a full-strength fill) paired with the stronger `primary` token for border/text, so
 * it reads as a label rather than a `Button`.
 */
export const classes = {
  base: cn(
    'snc:inline-flex snc:w-max snc:items-center',
    'snc:rounded-md snc:border',
    'snc:px-3 snc:py-1',
    'snc:bg-snc-primary-subtle-bg snc:border-snc-primary snc:text-snc-primary',
    'snc:font-snc-heading snc:text-xs snc:font-semibold snc:uppercase',
  ),
} as const;
