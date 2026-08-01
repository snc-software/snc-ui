import { cn } from '@/Utils/cn';

export const classes = {
  root: cn('snc:flex snc:items-center snc:gap-6', 'snc:font-snc-body snc:text-sm'),
  link: cn(
    'snc:inline-flex snc:items-center',
    'snc:border-b-2 snc:border-transparent snc:pb-1',
    'snc:text-snc-text-primary snc:transition-colors snc:duration-150',
    'snc:hover:text-snc-primary',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
  linkActive: cn('snc:border-snc-primary snc:text-snc-primary'),
} as const;
