import { cn } from '@/Utils/cn';

/**
 * Follows the design system's established "Toasts" pattern: bg/border/text triad from the
 * relevant semantic status, ~8px rounded corners. Same triad shape as StatusPill/TableFilterChip.
 */
export const classes = {
  base: cn('snc:flex snc:items-start snc:gap-3', 'snc:rounded-lg snc:border', 'snc:p-4'),
  content: cn('snc:flex snc:flex-1 snc:flex-col snc:gap-1'),
  heading: cn('snc:font-snc-heading snc:text-sm snc:font-semibold'),
  subtext: cn('snc:font-snc-body snc:text-sm'),
  dismissButton: cn(
    'snc:inline-flex snc:items-center snc:justify-center',
    'snc:rounded-full snc:p-0',
    'snc:transition-opacity snc:duration-150 snc:hover:opacity-70',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
} as const;
