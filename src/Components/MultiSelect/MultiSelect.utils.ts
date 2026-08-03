import {
  isOptionItem,
  isOptionsArray,
  isOptionsCollection,
  isOptionsGroup,
} from '@/Components/OptionsList';

import type { OptionItem, Options } from '@/Components/OptionsList';

/**
 * Flattens `options` down to its leaf `OptionItem`s, in the same order `OptionsList` renders them, so
 * the trigger can look up the `title` of each selected id regardless of how deeply nested it is.
 * Duplicate of `CmdK.utils.ts`'s identically-shaped function — kept local rather than extracted,
 * consistent with this repo's existing precedent of small pattern-local copies over premature shared
 * abstraction (e.g. `Autocomplete.constants.ts`'s copy of `Select.constants.ts`).
 */
export const flattenOptionItems = (options: Options): OptionItem[] => {
  if (isOptionsArray(options)) {
    return options.flatMap(flattenOptionItems);
  }

  if (isOptionItem(options)) {
    return [options];
  }

  if (isOptionsGroup(options)) {
    return flattenOptionItems(options.childOptions);
  }

  if (isOptionsCollection(options)) {
    return Object.values(options).flatMap(flattenOptionItems);
  }

  return [];
};
