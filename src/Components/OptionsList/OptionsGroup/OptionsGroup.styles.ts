import { cn } from '@/Utils/cn';

export const classes = {
  // The select-all checkbox and the collapse-toggle button are kept as two sibling controls, not one
  // nested inside the other — a native `<button>` cannot validly contain another interactive control
  // (e.g. an `<input>`), unlike the legacy library's own markup.
  header: cn(
    'snc:flex snc:w-full snc:items-center snc:gap-2',
    'snc:py-2 snc:pr-4',
    'snc:hover:bg-snc-primary-subtle-bg',
  ),
  headerButton: cn('snc:flex snc:flex-1 snc:items-center snc:gap-2 snc:text-left'),
  disabled: cn('snc:cursor-not-allowed snc:line-through snc:opacity-60 snc:hover:bg-transparent'),
  content: cn('snc:flex snc:min-w-0 snc:flex-1 snc:flex-col'),
  title: cn('snc:truncate snc:font-snc-body snc:text-sm snc:text-snc-text-primary'),
  titleActive: cn('snc:font-semibold'),
  description: cn('snc:truncate snc:font-snc-body snc:text-xs snc:text-snc-text-secondary'),
  chevron: cn(
    'snc:flex snc:shrink-0 snc:items-center snc:text-snc-text-secondary',
    'snc:transition-transform snc:duration-300',
  ),
  chevronOpen: cn('snc:rotate-180'),
} as const;
