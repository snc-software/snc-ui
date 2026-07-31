import { cn } from '@/Utils/cn';

export const classes = {
  // `text-snc-surface` rather than white, matching Button's primary variant — it flips to dark slate
  // against the lighter dark-mode raspberry, where white would sit at ~2.8:1.
  cell: cn(
    'snc:bg-snc-primary snc:text-snc-surface',
    'snc:border-t-0 snc:text-left snc:font-normal',
  ),
  content: cn('snc:flex snc:items-center snc:gap-2'),
  title: cn('snc:flex snc:flex-1 snc:items-center snc:text-left'),
  titleText: cn(
    'snc:w-full snc:flex-1',
    'snc:font-snc-heading snc:text-xs snc:font-bold snc:uppercase snc:tracking-wide',
  ),
  // Keyed off the header foreground, not the body text tokens — including the ring, which would
  // otherwise be primary-on-primary.
  control: cn(
    'snc:inline-flex snc:items-center snc:justify-center',
    'snc:rounded snc:p-0 snc:text-snc-surface/70',
    'snc:transition-colors snc:duration-150',
    'snc:hover:text-snc-surface',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-surface',
  ),
  filterTrigger: cn('snc:flex snc:flex-1 snc:items-center snc:gap-2 snc:text-left'),
  filterIcon: cn('snc:transition-transform snc:duration-300'),
} as const;
