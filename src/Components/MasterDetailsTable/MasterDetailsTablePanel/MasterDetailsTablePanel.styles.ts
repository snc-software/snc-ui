import { cn } from '@/Utils/cn';

/**
 * The pane's surface is the shared `TableBase` `surface` itself (applied alongside `root` in the
 * component), not a copy of it — so the detail pane and the list beside it can't drift apart. The
 * header then mirrors `TableHeadCell`'s primary fill and `titleText` typography, which is what makes
 * the two panes read as one component family.
 *
 * `surface` centres its children, so the header and body claim the full width explicitly.
 */
export const classes = {
  root: cn('snc:h-full snc:min-h-0 snc:w-full'),
  header: cn(
    'snc:flex snc:w-full snc:shrink-0 snc:items-center snc:gap-2',
    'snc:border-b snc:border-snc-border',
    'snc:bg-snc-primary snc:p-3 snc:text-snc-surface',
  ),
  title: cn(
    'snc:flex-1',
    'snc:font-snc-heading snc:text-xs snc:font-bold snc:uppercase snc:tracking-wide',
  ),
  // Ring keys off the header foreground rather than primary, which would be primary-on-primary.
  closeButton: cn(
    'snc:ml-auto snc:inline-flex snc:shrink-0 snc:items-center snc:justify-center',
    'snc:rounded snc:p-0 snc:text-snc-surface',
    'snc:hover:bg-snc-primary-hover',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-surface',
  ),
  body: cn(
    'snc:min-h-0 snc:w-full snc:flex-1 snc:overflow-y-auto snc:p-4',
    'snc:font-snc-body snc:text-sm snc:text-snc-text-primary',
  ),
} as const;
