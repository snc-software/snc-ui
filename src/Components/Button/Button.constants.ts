import { cn } from '@/Utils/cn';

export const IconSize = 16;

// Pulls the icon in from classes.base's snc:px-4 button edge padding and tightens its
// snc:gap-2 (8px) to the label. Icon glyphs vary in how much internal padding they carry
// within their own viewBox (compare a thin outline arrow to a solid, edge-to-edge glyph), so
// no fixed correction reads identically for every consumer-supplied icon — these values are a
// reasonable middle ground, not a per-icon exact match. Does not affect the isLoading
// Spinner's spacing.
export const IconPositions = {
  leading: cn('snc:-ml-1.5 snc:-mr-1'),
  trailing: cn('snc:-mr-1.5 snc:-ml-1'),
} as const;

export const Variants = {
  primary: cn('snc:bg-snc-primary snc:text-snc-surface', 'snc:hover:bg-snc-primary-hover'),
  secondary: cn(
    'snc:border-snc-primary snc:bg-transparent snc:text-snc-primary',
    'snc:hover:bg-snc-primary-subtle-bg',
  ),
  round: cn(
    'snc:rounded-full snc:bg-snc-primary snc:text-snc-surface',
    'snc:hover:bg-snc-primary-hover',
  ),
  text: cn(
    'snc:border-transparent snc:bg-transparent snc:text-snc-primary',
    'snc:hover:bg-snc-primary-subtle-bg',
  ),
} as const;
