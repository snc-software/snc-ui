import { cn } from '@/Utils/cn';

export const classes = {
  wrapper: cn('snc:inline-flex snc:w-full snc:flex-col'),
  trigger: cn(
    'snc:flex snc:w-full snc:items-center snc:gap-2.5',
    'snc:border snc:bg-snc-surface',
    'snc:text-left snc:text-snc-text-primary snc:font-snc-body snc:leading-5',
    'snc:transition-colors snc:duration-150',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-snc-primary snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  triggerClosed: cn('snc:rounded-md'),
  // Squared-off bottom while open so trigger and panel read as one surface.
  triggerOpen: cn('snc:rounded-t-md snc:border-snc-primary'),
  // `min-w-0` overrides the flex item's default min-content floor — without it, `overflow-hidden` +
  // `text-ellipsis` never actually get a chance to kick in inside a shrinking flex row (e.g. two
  // Selects sharing a fixed-width toolbar).
  value: cn('snc:min-w-0 snc:flex-1 snc:overflow-hidden snc:text-ellipsis snc:whitespace-nowrap'),
  placeholder: cn('snc:opacity-50'),
  chevron: cn(
    'snc:flex snc:shrink-0 snc:items-center snc:text-snc-text-secondary',
    'snc:transition-transform snc:duration-300',
  ),
  chevronOpen: cn('snc:rotate-180'),
  // Delta over Popout's base panel only.
  panel: cn(
    'snc:overflow-auto',
    'snc:rounded-b-lg snc:border-snc-primary',
    'snc:font-snc-body snc:shadow-xl',
    'snc:focus:outline-none',
  ),
  option: cn(
    'snc:flex snc:w-full snc:cursor-pointer snc:select-none snc:items-center snc:whitespace-nowrap',
    'snc:py-2',
    'snc:hover:bg-snc-primary-subtle-bg',
    'snc:focus-visible:outline-none snc:focus-visible:bg-snc-primary-subtle-bg',
  ),
  optionSelected: cn('snc:bg-snc-primary-subtle-bg'),
  optionDisabled: cn(
    'snc:cursor-not-allowed snc:line-through snc:opacity-60',
    'snc:hover:bg-transparent',
  ),
} as const;
