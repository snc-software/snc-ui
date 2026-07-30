import { cn } from '@/Utils/cn';

export const classes = {
  base: cn('snc:flex snc:min-w-max snc:items-center snc:gap-3'),
  // `Select` fills its container by design, so the toolbar pins it to a width that fits the widest
  // page size rather than letting it stretch across the bar.
  select: cn('snc:w-20'),
  label: cn('snc:font-snc-body snc:text-sm snc:text-snc-text-secondary'),
} as const;
