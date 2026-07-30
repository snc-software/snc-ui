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
  // Open, the trigger squares off its bottom corners and takes the panel's border colour so the two
  // read as a single surface — as they do in the source library.
  triggerOpen: cn('snc:rounded-t-md snc:border-snc-primary'),
  value: cn('snc:flex-1 snc:overflow-hidden snc:text-ellipsis snc:whitespace-nowrap'),
  placeholder: cn('snc:opacity-50'),
  chevron: cn(
    'snc:flex snc:shrink-0 snc:items-center snc:text-snc-text-secondary',
    'snc:transition-transform snc:duration-300',
  ),
  chevronOpen: cn('snc:rotate-180'),
  // `fixed` because the panel is portalled to `document.body` and positioned from the trigger's
  // viewport rect — see `useAnchoredPosition` for why it cannot simply sit next to the trigger.
  panel: cn(
    'snc:fixed snc:z-50 snc:overflow-auto',
    'snc:rounded-b-lg snc:border-x snc:border-b snc:border-snc-primary',
    'snc:bg-snc-surface snc:text-snc-text-primary snc:font-snc-body snc:shadow-xl',
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
