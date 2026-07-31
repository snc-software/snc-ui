import { cn } from '@/Utils/cn';

export const classes = {
  // On the wrapper, not the label: the label isn't a sibling of the input, so `peer-checked` can't
  // reach it, but `:has()` matches any descendant regardless of nesting depth. Same technique
  // `Checkbox` uses.
  wrapper: cn('snc:inline-flex snc:items-center snc:gap-2', 'snc:has-[:checked]:font-bold'),
  track: cn('snc:relative snc:inline-flex snc:h-6 snc:w-11 snc:shrink-0 snc:items-center'),
  // Absolutely positioned to fill the track: like `Checkbox`, the input itself *is* the visual
  // control (the box there, the pill here) rather than a hidden input styled via a sibling.
  input: cn(
    'snc:peer snc:absolute snc:inset-0 snc:h-full snc:w-full snc:cursor-pointer snc:appearance-none',
    'snc:rounded-full snc:border',
    'snc:transition-colors snc:duration-200',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  // Overlaid, since an <input> cannot have children. Kept a direct sibling so `peer-checked` resolves,
  // same technique `Checkbox` uses for its check icon.
  thumb: cn(
    'snc:pointer-events-none snc:absolute snc:left-0.5 snc:inline-block snc:h-5 snc:w-5',
    'snc:rounded-full snc:bg-snc-surface snc:shadow',
    'snc:transition-transform snc:duration-200',
    'snc:peer-checked:translate-x-5',
  ),
  label: cn('snc:font-snc-body snc:text-sm snc:text-snc-text-primary'),
} as const;
