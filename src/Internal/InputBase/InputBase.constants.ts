import { cn } from '@/Utils/cn';

/**
 * The only variant set shared by every input-like trigger (`Input`, `Select`, `DatePicker`,
 * `Autocomplete`) — border colour by error state, hover/focus affordance.
 */
export const Variants = {
  default: cn(
    'snc:border-snc-border',
    'snc:not-disabled:hover:border-snc-primary',
    'snc:focus-visible:border-snc-primary',
  ),
  error: cn('snc:border-snc-error-border snc:text-snc-error-text'),
} as const;
