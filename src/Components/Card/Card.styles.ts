import { cn } from '@/Utils/cn';

// Same bordered-surface treatment Modal/Wizard/Accordion's root already use.
export const classes = {
  root: cn(
    'snc:w-full snc:overflow-hidden',
    'snc:rounded-xl snc:border snc:border-snc-border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
  ),
  header: cn('snc:border-b snc:border-snc-border', 'snc:px-6 snc:py-4'),
  content: cn('snc:px-6 snc:py-4'),
  actions: cn(
    'snc:flex snc:items-center snc:gap-2',
    'snc:border-t snc:border-snc-border',
    'snc:px-6 snc:py-4',
  ),
} as const;
