import { cn } from '@/Utils/cn';

export const classes = {
  // The bold-when-selected label comes from the source library, which drives it off the checked and
  // indeterminate states. It is applied here rather than on the label because the label is not a
  // sibling of the input, so a `peer-checked` variant cannot reach it — `has-*` inspects the whole
  // subtree instead, and font-weight inherits down to the label. Driving it from CSS rather than from
  // a React prop keeps it correct for uncontrolled checkboxes, where React never sees `checked`.
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
