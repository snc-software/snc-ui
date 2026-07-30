import { cn } from '@/Utils/cn';

export const classes = {
  wrapper: cn('snc:inline-flex snc:items-center snc:gap-2'),
  control: cn('snc:relative snc:inline-flex snc:h-4 snc:w-4 snc:shrink-0'),
  input: cn(
    'snc:peer snc:h-4 snc:w-4 snc:appearance-none',
    'snc:rounded snc:border snc:bg-snc-surface',
    'snc:transition-colors snc:duration-150',
    'snc:focus-visible:outline-none snc:focus-visible:ring-2 snc:focus-visible:ring-offset-2',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
  // The tick sits over the input rather than inside it — an <input> cannot have children. It is a
  // direct sibling of the input so the `peer-checked` variant resolves (`.peer:checked ~ &`), letting
  // CSS drive the tick for uncontrolled checkboxes where React never sees the checked state.
  icon: cn(
    'snc:pointer-events-none snc:absolute snc:inset-0',
    'snc:items-center snc:justify-center',
    'snc:text-snc-surface',
  ),
  iconAlways: cn('snc:flex'),
  iconWhenChecked: cn('snc:hidden snc:peer-checked:flex'),
  label: cn('snc:font-snc-body snc:text-sm snc:text-snc-text-primary'),
} as const;
