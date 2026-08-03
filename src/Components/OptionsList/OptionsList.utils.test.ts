import { describe, expect, it } from 'vitest';

import { filterSelectedOptions, getIndent, getOptionsIds } from './OptionsList.utils';

import type { OptionsCollection } from './OptionsList.types';

describe('OptionsList.utils', () => {
  describe('getOptionsIds', () => {
    it('flattens ids from a nested array of options', () => {
      const ids = getOptionsIds([
        { id: 'one', title: 'One' },
        { id: 'two', title: 'Two' },
      ]);

      expect(ids).toEqual(['one', 'two']);
    });

    it('returns a single id for a bare OptionItem', () => {
      expect(getOptionsIds({ id: 'one', title: 'One' })).toEqual(['one']);
    });

    it('recurses into an OptionsGroup childOptions', () => {
      const ids = getOptionsIds({
        title: 'Group',
        childOptions: [
          { id: 'one', title: 'One' },
          { id: 'two', title: 'Two' },
        ],
      });

      expect(ids).toEqual(['one', 'two']);
    });

    it('flattens ids across every group of an OptionsCollection', () => {
      const options: OptionsCollection = {
        groupA: [{ id: 'one', title: 'One' }],
        groupB: [{ id: 'two', title: 'Two' }],
      };

      expect(getOptionsIds(options)).toEqual(['one', 'two']);
    });
  });

  describe('getIndent', () => {
    it('leaves indent unchanged when passing through an array, item, or group', () => {
      expect(getIndent(1, [{ id: 'one', title: 'One' }])).toBe(1);
      expect(getIndent(1, { id: 'one', title: 'One' })).toBe(1);
      expect(getIndent(1, { title: 'Group', childOptions: { id: 'one', title: 'One' } })).toBe(1);
    });

    it('increments indent when passing through an OptionsCollection', () => {
      const options: OptionsCollection = { groupA: { id: 'one', title: 'One' } };

      expect(getIndent(1, options)).toBe(2);
    });
  });

  describe('filterSelectedOptions', () => {
    it('keeps only selected items from a flat array', () => {
      const options = [
        { id: 'one', title: 'One' },
        { id: 'two', title: 'Two' },
      ];

      expect(filterSelectedOptions(options, ['two'])).toEqual([{ id: 'two', title: 'Two' }]);
    });

    it('returns null for a bare OptionItem that is not selected', () => {
      expect(filterSelectedOptions({ id: 'one', title: 'One' }, [])).toBeNull();
    });

    it('keeps a group only when it has a selected descendant, preserving group metadata', () => {
      const group = {
        title: 'Group',
        childOptions: [
          { id: 'one', title: 'One' },
          { id: 'two', title: 'Two' },
        ],
      };

      expect(filterSelectedOptions(group, ['two'])).toEqual({
        title: 'Group',
        childOptions: [{ id: 'two', title: 'Two' }],
      });
    });

    it('drops a group entirely when none of its children are selected', () => {
      const group = { title: 'Group', childOptions: { id: 'one', title: 'One' } };

      expect(filterSelectedOptions(group, [])).toBeNull();
    });

    it('keeps only collection groups with a selected descendant', () => {
      const options: OptionsCollection = {
        groupA: { id: 'one', title: 'One' },
        groupB: { id: 'two', title: 'Two' },
      };

      expect(filterSelectedOptions(options, ['two'])).toEqual({
        groupB: { id: 'two', title: 'Two' },
      });
    });

    it('returns null for an OptionsCollection with no selected descendants at all', () => {
      const options: OptionsCollection = { groupA: { id: 'one', title: 'One' } };

      expect(filterSelectedOptions(options, [])).toBeNull();
    });
  });
});
