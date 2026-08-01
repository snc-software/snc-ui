import { cn } from '@/Utils/cn';

/**
 * Same surface/border/text trio Modal's panel and MasterDetailsTablePanel use. Sections are
 * divided by the shared border token (`divide-y`) rather than each section drawing its own border.
 */
export const classes = {
  root: cn(
    'snc:w-full snc:overflow-hidden',
    'snc:rounded-xl snc:border snc:border-snc-border snc:divide-y snc:divide-snc-border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
  ),
  sectionHeading: cn('snc:m-0'),
  header: cn(
    'snc:flex snc:w-full snc:items-center snc:justify-between snc:gap-2',
    'snc:px-4 snc:py-3 snc:text-left',
    'snc:font-snc-body snc:text-sm snc:font-medium',
    'snc:transition-colors snc:duration-150',
    'snc:hover:bg-snc-surface-accent',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
  headerOpen: cn('snc:bg-snc-accent-subtle-bg snc:text-snc-accent'),
  headerText: cn('snc:flex-1'),
  chevron: cn(
    'snc:flex snc:shrink-0 snc:items-center snc:text-snc-text-secondary',
    'snc:transition-transform snc:duration-300',
  ),
  chevronOpen: cn('snc:rotate-180 snc:text-snc-accent'),
  panel: cn('snc:px-4 snc:pt-2 snc:pb-4', 'snc:font-snc-body snc:text-sm'),
} as const;
