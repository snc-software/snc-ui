import { cn } from '@/Utils/cn';

export { Variants } from '@/Internal/InputBase';

/**
 * Copied from `Select.constants.ts` rather than shared via `Internal/InputBase` — this dropdown
 * height scale isn't used by `Input`/`DatePicker`, so it doesn't clear the "shared by all four"
 * extraction bar.
 */
export const Sizes = {
  sm: cn('snc:h-8 snc:pl-3.5 snc:pr-2 snc:text-sm'),
  md: cn('snc:h-12 snc:pl-5 snc:pr-5 snc:text-sm'),
} as const;

/**
 * Option rows run taller than the trigger in the source library, so they carry their own scale
 * rather than reusing {@link Sizes}.
 */
export const OptionSizes = {
  sm: cn('snc:h-8 snc:pl-3.5 snc:pr-2 snc:text-sm'),
  md: cn('snc:h-11 snc:pl-5 snc:pr-5 snc:text-sm'),
} as const;

/**
 * Height of one option row, in `rem`. Multiplied by `visibleOptions` to cap the panel height, so the
 * list scrolls at exactly the requested number of rows.
 */
export const OptionRowHeightRem = 2.75;

export const DefaultVisibleOptions = 7;

export const ChevronSize = 16;

export const DefaultNoResultsMessage = 'No results found';
