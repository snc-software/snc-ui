import { classes as baseClasses } from '@/Internal/InputBase';
import { cn } from '@/Utils/cn';

export const classes = {
  wrapper: cn('snc:inline-flex snc:w-full snc:flex-col snc:gap-1.5'),
  inputWrapper: cn('snc:relative snc:flex snc:w-full snc:items-center'),
  // `pr-10` (icon clearance for the absolutely-positioned chevron) is applied after `Sizes`' own
  // `pr-2`/`pr-5` (tuned for Select's flex-gap layout, not an overlay) so it wins the merge.
  input: cn(baseClasses.base, 'snc:block snc:w-full snc:pr-10'),
  // Delta over Popout's base panel only, matching Select's merged trigger+panel treatment.
  triggerOpen: cn('snc:rounded-t-md snc:border-snc-primary'),
  triggerClosed: cn('snc:rounded-md'),
  chevron: cn(
    'snc:pointer-events-none snc:absolute snc:right-3 snc:flex snc:shrink-0 snc:items-center',
    'snc:text-snc-text-secondary snc:transition-transform snc:duration-300',
  ),
  chevronOpen: cn('snc:rotate-180'),
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
  ),
  optionHighlighted: cn('snc:bg-snc-primary-subtle-bg'),
  optionSelected: cn('snc:bg-snc-primary-subtle-bg'),
  optionDisabled: cn(
    'snc:cursor-not-allowed snc:line-through snc:opacity-60',
    'snc:hover:bg-transparent',
  ),
  noResults: cn(
    'snc:flex snc:w-full snc:cursor-default snc:select-none snc:items-center snc:whitespace-nowrap',
    'snc:py-2 snc:text-snc-text-secondary',
  ),
} as const;
