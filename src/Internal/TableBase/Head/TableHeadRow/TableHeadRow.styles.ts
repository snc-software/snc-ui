import { cn } from '@/Utils/cn';

export const classes = {
  selectionCell: cn('snc:w-10 snc:bg-snc-primary', 'snc:border-l-0 snc:border-t-0 snc:font-normal'),
  // Inverted: Checkbox's checked treatment is a primary box, which vanishes on the primary fill.
  // Scoped here rather than added as a public Checkbox variant — it's the header's problem.
  selectionCheckbox: cn(
    'snc:[&_input]:border-snc-surface',
    'snc:[&_input:checked]:border-snc-surface snc:[&_input:checked]:bg-snc-surface',
    'snc:[&_input:indeterminate]:border-snc-surface snc:[&_input:indeterminate]:bg-snc-surface',
    'snc:[&_span[aria-hidden]]:text-snc-primary',
    'snc:[&_input]:focus-visible:ring-snc-surface',
  ),
  // Trims the outer edges so the grid's border sits flush with the surrounding rounded container.
  firstColumn: cn('snc:border-l-0'),
  lastColumn: cn('snc:border-r-0'),
} as const;
