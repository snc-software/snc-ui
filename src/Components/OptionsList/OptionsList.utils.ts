import { isOptionItem, isOptionsArray, isOptionsCollection, isOptionsGroup } from './optionChecker';

import type { Options } from './OptionsList.types';

export const getOptionsIds = (options: Options): string[] => {
  if (isOptionsArray(options)) {
    return options.map((option) => getOptionsIds(option)).flat(1);
  }

  if (isOptionItem(options)) {
    return [options.id];
  }

  if (isOptionsGroup(options)) {
    return getOptionsIds(options.childOptions);
  }

  if (isOptionsCollection(options)) {
    return Object.values(options)
      .map((value) => getOptionsIds(value))
      .flat(2);
  }

  throw new TypeError('Invalid type of options');
};

export const getIndent = (indent: number, options: Options): number => {
  if (isOptionsArray(options) || isOptionItem(options) || isOptionsGroup(options)) {
    return indent;
  }

  if (isOptionsCollection(options)) {
    return indent + 1;
  }

  throw new TypeError('Invalid type of options');
};

/**
 * Ported from the legacy library's `MultiSelectDropdown/utils.tsx` — it's only ever used by
 * `OptionsList`'s own `selectedOnly` feature and has no other home now that `MultiSelectDropdown`
 * itself isn't being built.
 */
export const filterSelectedOptions = (options: Options, selectedIds: string[]): Options | null => {
  if (isOptionsArray(options)) {
    const filtered = options
      .map((subOption) => filterSelectedOptions(subOption, selectedIds))
      .filter((subOption): subOption is Options => subOption !== null);

    return filtered.length ? filtered : null;
  }

  if (isOptionItem(options)) {
    return selectedIds.includes(options.id) ? options : null;
  }

  if (isOptionsGroup(options)) {
    const filteredChildren = filterSelectedOptions(options.childOptions, selectedIds);

    return filteredChildren ? { ...options, childOptions: filteredChildren } : null;
  }

  if (isOptionsCollection(options)) {
    const filteredEntries = Object.entries(options)
      .map(([key, value]) => [key, filterSelectedOptions(value, selectedIds)] as const)
      .filter((entry): entry is [string, Options] => entry[1] !== null);

    return filteredEntries.length ? Object.fromEntries(filteredEntries) : null;
  }

  return null;
};
