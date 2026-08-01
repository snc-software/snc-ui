import { cn } from '@/Utils/cn';

export const classes = {
  clickable: cn('snc:cursor-pointer snc:hover:bg-snc-accent-subtle-bg'),
  selected: cn('snc:bg-snc-primary-subtle-bg'),
  // Shares `selected`'s subtle fill (the design system's documented treatment for a highlighted
  // row), then adds a leading bar so an open row still reads as distinct from a checkbox-selected
  // one when both apply. An inset shadow rather than a border, so it doesn't disturb the 1px cell
  // grid the whole table depends on.
  active: cn('snc:bg-snc-primary-subtle-bg', 'snc:shadow-[inset_3px_0_0_0_var(--snc-primary)]'),
  selectionCell: cn('snc:w-10 snc:border-l-0'),
  firstColumn: cn('snc:border-l-0'),
  lastColumn: cn('snc:border-r-0'),
} as const;
