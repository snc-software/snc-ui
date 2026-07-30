import { cn } from '@/Utils/cn';

/**
 * Follows the design system's established "Status pills" pattern: the full bg/border/text triad from a
 * single semantic status (info), pill shape, compact padding.
 */
export const classes = {
  base: cn(
    'snc:flex snc:w-max snc:items-center snc:gap-2',
    'snc:rounded-full snc:border',
    'snc:bg-snc-info-bg snc:border-snc-info-border snc:text-snc-info-text',
    'snc:py-2 snc:pl-4 snc:pr-3',
  ),
  content: cn('snc:flex snc:items-end snc:gap-1'),
  title: cn('snc:min-w-max snc:font-snc-body snc:text-sm'),
  value: cn('snc:min-w-max snc:font-snc-body snc:text-sm snc:font-bold'),
  clear: cn(
    'snc:inline-flex snc:items-center snc:justify-center',
    'snc:rounded-full snc:p-0',
    'snc:transition-opacity snc:duration-150 snc:hover:opacity-70',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
} as const;
