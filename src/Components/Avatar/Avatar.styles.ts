import { cn } from '@/Utils/cn';

// No established "avatar" pattern exists yet in DESIGN SYSTEM.md, so the fallback treatment is
// derived from the "Subtle backgrounds" pattern already used for selected/highlighted elements.
export const classes = {
  root: cn(
    'snc:inline-flex snc:shrink-0 snc:items-center snc:justify-center',
    'snc:overflow-hidden snc:rounded-full',
    'snc:font-snc-heading snc:font-semibold snc:select-none',
  ),
  image: cn('snc:h-full snc:w-full snc:object-cover'),
  fallback: cn('snc:flex snc:h-full snc:w-full snc:items-center snc:justify-center'),
} as const;
