import { isOptionItem, isOptionsArray, isOptionsCollection, isOptionsGroup } from '@/Components/OptionsList';

import type { OptionItem, Options } from '@/Components/OptionsList';

/**
 * Flattens `options` down to its leaf `OptionItem`s, in the same visual order `OptionsList`
 * renders them (array entries in order, a group's `childOptions` recursed into, a collection's
 * groups walked in key order) — group headers themselves are never included, since only leaf items
 * are activatable/highlightable.
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

/**
 * Walks one step from `currentId` in `direction`, wrapping around both ends, and returns the first
 * enabled item's id — mirroring `SearchInput`'s own `findEnabledIndex` traversal, adapted to ids
 * over a recursive/groupable tree instead of a flat array. Returns `null` when there is no enabled
 * item to land on at all.
 */
export const getAdjacentEnabledId = (
  options: Options,
  currentId: string | null,
  direction: 1 | -1,
): string | null => {
  const items = flattenOptionItems(options);
  const { length } = items;

  if (length === 0) {
    return null;
  }

  const currentIndex = currentId === null ? -1 : items.findIndex((item) => item.id === currentId);

  for (let offset = 1; offset <= length; offset += 1) {
    const index = (((currentIndex + direction * offset) % length) + length) % length;

    if (!items[index].disabled) {
      return items[index].id;
    }
  }

  return null;
};
