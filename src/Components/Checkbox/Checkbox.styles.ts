import { cn } from '@/Utils/cn';

export const classes = {
  // On the wrapper, not the label: the label is not a sibling of the input, so `peer-checked` cannot
  // reach it. CSS-driven so it stays correct for uncontrolled checkboxes.
  wrapper: cn(
    'snc:inline-flex snc:items-center snc:gap-2',
    'snc:has-[:checked]:font-bold snc:has-[:indeterminate]:font-bold',
  ),
  control: cn('snc:relative snc:inline-flex snc:h-4 snc:w-4 snc:shrink-0'),
  input: cn(
    'snc:peer snc:h-4 snc:w-4 snc:appearance-none',
    'snc:rounded snc:border snc:bg-snc-surface',
    'snc:transition-colors snc:duration-150',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  // Overlaid, since an <input> cannot have children. Kept a direct sibling so `peer-checked` resolves.
  icon: cn(
    'snc:pointer-events-none snc:absolute snc:inset-0',
    'snc:items-center snc:justify-center',
    'snc:text-snc-surface',
  ),
  iconAlways: cn('snc:flex'),
  iconWhenChecked: cn('snc:hidden snc:peer-checked:flex'),
  label: cn('snc:font-snc-body snc:text-sm snc:text-snc-text-primary'),
} as const;
