import { cn } from '@/Utils/cn';

export const classes = {
  /**
   * Box chrome shared by every input-like trigger. Rounding is excluded: `Input`/`DatePicker` want
   * it unconditionally, `Select`/`Autocomplete` toggle it via `triggerOpen`/`triggerClosed`.
   */
  base: cn(
    'snc:border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:font-snc-body snc:text-sm',
    'snc:placeholder:text-snc-text-secondary',
    'snc:transition-colors snc:duration-150',
    'snc:focus-visible:outline-none',
    'snc:disabled:cursor-not-allowed snc:disabled:opacity-60',
  ),
} as const;
