import { classes as baseClasses } from '@/Internal/InputBase';
import { cn } from '@/Utils/cn';

export const classes = {
  wrapper: cn('snc:inline-flex snc:w-full snc:flex-col snc:gap-1.5'),
  inputWrapper: cn('snc:relative snc:flex snc:w-full snc:items-center'),
  // `pl-10` (icon clearance for the absolutely-positioned prefix icon) is applied after `Sizes`' own
  // `pl-9`/`pl-11` so it wins the merge, same technique `Autocomplete` uses for its trailing chevron.
  input: cn(baseClasses.base, 'snc:block snc:w-full snc:pl-10'),
  // Delta over Popout's base panel only, matching Select/Autocomplete's merged trigger+panel look.
  triggerOpen: cn('snc:rounded-t-md snc:border-snc-primary'),
  triggerClosed: cn('snc:rounded-md'),
  prefixIcon: cn(
    'snc:pointer-events-none snc:absolute snc:left-3 snc:flex snc:shrink-0 snc:items-center',
    'snc:text-snc-text-secondary',
  ),
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
  // Horizontal/vertical spacing comes from `OptionSizes` (applied alongside this in the component),
  // matching real option rows exactly so the message doesn't sit flush against the panel edge.
  noResults: cn(
    'snc:flex snc:w-full snc:cursor-default snc:select-none snc:items-center snc:whitespace-nowrap',
    'snc:text-snc-text-secondary',
  ),
} as const;
