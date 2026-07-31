import { cn } from '@/Utils/cn';

/**
 * No established "modal/overlay" pattern exists yet in DESIGN SYSTEM.md, so the backdrop/card
 * treatment is derived from adjacent established tokens: the neutral scale for the scrim (a
 * structural/chrome element, not a brand accent) and the same surface/border/text trio Popout's
 * panel already uses.
 */
export const classes = {
  overlay: cn(
    'snc:fixed snc:inset-0 snc:z-50',
    'snc:flex snc:items-center snc:justify-center',
    'snc:p-4',
    'snc:bg-snc-neutral-950/60 snc:backdrop-blur-sm',
  ),
  // `w-fit` sizes the card to its content rather than a fixed component width. No max-height or
  // overflow here — the card is never itself a scroll container (a scrollbar appearing/disappearing
  // inside a w-fit box shifts its width). If content can exceed the viewport, scrolling it is the
  // consumer's own responsibility (e.g. an internal max-h + overflow-y-auto on their content).
  panel: cn(
    'snc:relative snc:w-fit',
    'snc:min-w-80 snc:max-w-[90vw]',
    'snc:rounded-xl snc:border snc:border-snc-border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:shadow-lg',
    'snc:p-6',
  ),
  closeButton: cn(
    'snc:absolute snc:top-3 snc:right-3',
    'snc:inline-flex snc:items-center snc:justify-center',
    'snc:rounded-full snc:p-1',
    'snc:text-snc-text-secondary',
    'snc:transition-opacity snc:duration-150 snc:hover:opacity-70',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary',
  ),
} as const;
