import { cn } from '@/Utils/cn';

export const classes = {
  messageCell: cn('snc:p-8'),
  message: cn(
    'snc:flex snc:items-center snc:justify-center',
    'snc:font-snc-body snc:text-sm snc:text-snc-text-secondary',
  ),
  spinner: cn('snc:text-snc-primary'),
} as const;
