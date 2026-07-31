import { cn } from '@/Utils/cn';

export const classes = {
  // Paints from `currentColor`, so a consumer can re-point it via `className` — Button does.
  base: cn('snc:inline-flex snc:items-center snc:justify-center', 'snc:text-snc-primary'),
  svg: cn('snc:animate-spin'),
  track: cn('snc:opacity-25'),
  head: cn('snc:opacity-75'),
} as const;
