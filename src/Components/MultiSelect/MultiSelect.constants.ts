import { cn } from '@/Utils/cn';

export { Variants } from '@/Internal/InputBase';

export const Sizes = {
  sm: cn('snc:h-8 snc:pl-3.5 snc:pr-2 snc:text-sm'),
  md: cn('snc:h-12 snc:pl-5 snc:pr-5 snc:text-sm'),
} as const;

/**
 * Height of one `OptionsList` checkbox row, in `rem`. Multiplied by `visibleOptions` to cap the panel
 * height. Derived from `OptionItem.styles.ts`'s `py-2` (0.5rem top + bottom = 1rem) plus `text-sm`'s
 * default 1.25rem line-height — not reused from `Select`'s `2.75rem`, which describes Select's own
 * `h-11` option rows rather than `OptionItem`'s.
 */
export const OptionRowHeightRem = 2.25;

export const DefaultVisibleOptions = 7;

export const DefaultPlaceholder = 'Select';

export const ChevronSize = 16;
