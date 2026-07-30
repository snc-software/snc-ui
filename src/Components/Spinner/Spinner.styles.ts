import { cn } from '@/Utils/cn';

export const classes = {
  // Primary by default, matching the source library's loading indicator. The SVG paints from
  // `currentColor`, so a consumer can re-point it by passing any text colour through `className` —
  // `Button` does exactly that so its spinner tracks the button's own foreground.
  base: cn('snc:inline-flex snc:items-center snc:justify-center', 'snc:text-snc-primary'),
  svg: cn('snc:animate-spin'),
  track: cn('snc:opacity-25'),
  head: cn('snc:opacity-75'),
} as const;
