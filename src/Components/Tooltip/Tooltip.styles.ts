import { cn } from '@/Utils/cn';

// Same bordered-surface floating-panel family as `Internal/Popout`'s panel, sized down for a
// short hint rather than a menu.
export const classes = {
  // Wraps the trigger so its rect can be measured without cloning a ref onto the consumer's own
  // element. `inline-flex` keeps the wrapper hugging the trigger's own box rather than stretching
  // to a block's full width.
  wrapper: cn('snc:inline-flex'),
  panel: cn(
    'snc:fixed snc:z-50',
    'snc:max-w-xs',
    'snc:rounded-md snc:border snc:border-snc-border',
    'snc:bg-snc-surface snc:text-snc-text-primary',
    'snc:px-2 snc:py-1 snc:font-snc-body snc:text-sm',
    'snc:shadow-lg',
  ),
} as const;
