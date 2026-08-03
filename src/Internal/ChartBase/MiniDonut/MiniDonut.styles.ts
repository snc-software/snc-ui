import { cn } from '@/Utils/cn';

export const classes = {
  root: cn('snc:relative snc:inline-flex snc:shrink-0 snc:items-center snc:justify-center'),
  label: cn(
    'snc:absolute snc:inset-0 snc:flex snc:items-center snc:justify-center',
    'snc:font-snc-heading snc:font-semibold snc:text-snc-text-primary',
  ),
};
