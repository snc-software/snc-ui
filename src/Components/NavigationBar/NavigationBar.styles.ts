import { cn } from '@/Utils/cn';

// No established "nav bar" pattern exists yet in DESIGN SYSTEM.md, so the chrome is derived from
// the same surface/border/text trio Modal's panel and Accordion's root already use.
export const classes = {
  // Fixed 25% / 1fr / 25% columns keep the centre column pinned to the middle 50% (25-75%) of the
  // bar regardless of leading/trailing content width, rather than just visually centring it.
  root: cn(
    'snc:grid snc:w-full snc:grid-cols-[25%_1fr_25%] snc:items-center snc:gap-6',
    'snc:border-b snc:border-snc-border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:px-6 snc:py-4',
  ),
  leading: cn('snc:flex snc:items-center snc:gap-8'),
  center: cn('snc:flex snc:items-center snc:justify-center'),
  trailing: cn('snc:flex snc:items-center snc:gap-4 snc:justify-self-end'),
} as const;
