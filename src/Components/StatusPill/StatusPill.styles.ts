import { cn } from '@/Utils/cn';

/**
 * Follows the design system's established "Status pills" pattern: pill/rounded-full shape,
 * compact padding, same triad shape as toasts and TableFilterChip.
 */
export const classes = {
  base: cn(
    'snc:inline-flex snc:w-max snc:items-center',
    'snc:rounded-full snc:border',
    'snc:px-3 snc:py-1',
    'snc:font-snc-heading snc:text-xs snc:font-medium snc:uppercase',
  ),
} as const;
