import { describe, expect, it } from 'vitest';

import { flattenOptionItems, getAdjacentEnabledId } from './CmdK.utils';

import type { Options } from '@/Components/OptionsList';

describe('CmdK.utils', () => {
  describe('flattenOptionItems', () => {
    it('flattens a flat array of items in order', () => {
      const options: Options = [
        { id: 'one', title: 'One' },
        { id: 'two', title: 'Two' },
      ];

      expect(flattenOptionItems(options).map((item) => item.id)).toEqual(['one', 'two']);
    });

    it('returns a single-element array for a bare item', () => {
      expect(flattenOptionItems({ id: 'one', title: 'One' }).map((item) => item.id)).toEqual([
        'one',
      ]);
    });

    it("recurses into a group's childOptions without including the group itself", () => {
      const options: Options = {
        title: 'Group',
        childOptions: [
          { id: 'one', title: 'One' },
          { id: 'two', title: 'Two' },
        ],
      };

      expect(flattenOptionItems(options).map((item) => item.id)).toEqual(['one', 'two']);
    });

    it('flattens a collection across its groups in key order', () => {
      const options: Options = {
        groupA: [{ id: 'one', title: 'One' }],
        groupB: [{ id: 'two', title: 'Two' }],
      };

      expect(flattenOptionItems(options).map((item) => item.id)).toEqual(['one', 'two']);
    });
  });

  describe('getAdjacentEnabledId', () => {
    const options: Options = [
      { id: 'one', title: 'One' },
      { id: 'two', title: 'Two', disabled: true },
      { id: 'three', title: 'Three' },
    ];

    it('returns the first enabled item when currentId is null', () => {
      expect(getAdjacentEnabledId(options, null, 1)).toBe('one');
    });

    it('moves forward to the next enabled item, skipping a disabled one', () => {
      expect(getAdjacentEnabledId(options, 'one', 1)).toBe('three');
    });

    it('moves backward to the previous enabled item, skipping a disabled one', () => {
      expect(getAdjacentEnabledId(options, 'three', -1)).toBe('one');
    });

    it('wraps forward past the last item back to the first', () => {
      expect(getAdjacentEnabledId(options, 'three', 1)).toBe('one');
    });

    it('wraps backward past the first item back to the last', () => {
      expect(getAdjacentEnabledId(options, 'one', -1)).toBe('three');
    });

    it('returns null when there are no items at all', () => {
      expect(getAdjacentEnabledId([], null, 1)).toBeNull();
    });

    it('returns null when every item is disabled', () => {
      const allDisabled: Options = [
        { id: 'one', title: 'One', disabled: true },
        { id: 'two', title: 'Two', disabled: true },
      ];

      expect(getAdjacentEnabledId(allDisabled, null, 1)).toBeNull();
    });
  });
});
