import { cn } from '@/Utils/cn';

export const classes = {
  root: cn('snc:flex snc:items-center snc:gap-6', 'snc:font-snc-body snc:text-sm'),
  item: cn('snc:relative'),
  link: cn(
    'snc:inline-flex snc:items-center snc:gap-1',
    'snc:border-b-2 snc:border-transparent snc:pb-1',
    'snc:text-snc-text-primary snc:transition-colors snc:duration-150',
    'snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
  linkActive: cn('snc:border-snc-primary snc:text-snc-primary'),
  trigger: cn('snc:cursor-pointer'),
  chevron: cn('snc:transition-transform snc:duration-300'),
  chevronOpen: cn('snc:rotate-180'),
  // Delta over Popout's base panel only.
  panel: cn(
    'snc:min-w-40 snc:overflow-hidden snc:rounded-lg snc:border snc:border-snc-border',
    'snc:bg-snc-surface snc:py-1 snc:shadow-xl',
  ),
  dropdownLink: cn(
    'snc:block snc:w-full snc:whitespace-nowrap snc:px-3 snc:py-2 snc:text-left',
    'snc:text-snc-text-primary',
    'snc:hover:bg-snc-primary-subtle-bg',
    'snc:focus-visible:outline-none snc:focus-visible:bg-snc-primary-subtle-bg',
  ),
  dropdownLinkActive: cn('snc:bg-snc-primary-subtle-bg snc:text-snc-primary'),
} as const;
