import { describe, expect, it } from 'vitest';

import { search } from './OptionsList.search';

import type { OptionsCollection } from './OptionsList.types';

describe('OptionsList.search', () => {
  it('returns the options unchanged when no searchTerm is given', () => {
    const options = [{ id: 'one', title: 'One' }];

    expect(search(options, undefined)).toBe(options);
  });

  it('matches a bare OptionItem by partial title (default match mode)', () => {
    const option = { id: 'one', title: 'One Fish' };

    expect(search(option, 'fish')).toEqual(option);
  });

  it('does not match a bare OptionItem when neither id nor title matches', () => {
    const option = { id: 'one', title: 'One Fish' };

    expect(search(option, 'cat')).toBeUndefined();
  });

  it('matches on id when searchOptions.id is exact-match', () => {
    const option = { id: 'exact-id', title: 'Something else' };

    expect(search(option, 'exact-id', { id: 'exact-match' })).toEqual(option);
    expect(search(option, 'exact-i', { id: 'exact-match' })).toBeUndefined();
  });

  it('matches on id with partial-match', () => {
    const option = { id: 'exact-id', title: 'Something else' };

    expect(search(option, 'act-i', { id: 'partial-match' })).toEqual(option);
  });

  it('filters an array of options down to only the matching entries', () => {
    const options = [
      { id: 'one', title: 'One Fish' },
      { id: 'two', title: 'Two Fish' },
      { id: 'three', title: 'Three Cat' },
    ];

    expect(search(options, 'fish')).toEqual([
      { id: 'one', title: 'One Fish' },
      { id: 'two', title: 'Two Fish' },
    ]);
  });

  it('returns undefined for an array with no matches', () => {
    const options = [{ id: 'one', title: 'One Fish' }];

    expect(search(options, 'cat')).toBeUndefined();
  });

  it('flattens an array down to the single matching option when flattenWhenSingleChild is set', () => {
    const options = [
      { id: 'one', title: 'One Fish' },
      { id: 'two', title: 'Two Cat' },
    ];

    expect(
      search(options, 'cat', { title: 'partial-match', flattenWhenSingleChild: true }),
    ).toEqual({
      id: 'two',
      title: 'Two Cat',
    });
  });

  it('matches an OptionsGroup by its own title, returning the whole group', () => {
    const group = {
      title: 'Fish',
      childOptions: [{ id: 'one', title: 'One' }],
    };

    expect(search(group, 'fish')).toEqual(group);
  });

  it("matches an OptionsGroup by a matching child, keeping the group's own metadata", () => {
    const group = {
      title: 'Group',
      childOptions: [
        { id: 'one', title: 'One Fish' },
        { id: 'two', title: 'Two Cat' },
      ],
    };

    expect(search(group, 'fish')).toEqual({
      title: 'Group',
      childOptions: [{ id: 'one', title: 'One Fish' }],
    });
  });

  it('flattens an OptionsGroup down to a single matching child when flattenWhenSingleChild is set', () => {
    const group = {
      title: 'Group',
      childOptions: [
        { id: 'one', title: 'One Fish' },
        { id: 'two', title: 'Two Cat' },
      ],
    };

    expect(search(group, 'fish', { title: 'partial-match', flattenWhenSingleChild: true })).toEqual(
      { id: 'one', title: 'One Fish' },
    );
  });

  it('returns undefined for an OptionsGroup with no matching title or children', () => {
    const group = { title: 'Group', childOptions: { id: 'one', title: 'One' } };

    expect(search(group, 'cat')).toBeUndefined();
  });

  it('filters an OptionsCollection down to only groups with a match', () => {
    const options: OptionsCollection = {
      groupA: { id: 'one', title: 'One Fish' },
      groupB: { id: 'two', title: 'Two Cat' },
    };

    expect(search(options, 'fish')).toEqual({ groupA: { id: 'one', title: 'One Fish' } });
  });

  it('returns undefined for an OptionsCollection with no matches anywhere', () => {
    const options: OptionsCollection = { groupA: { id: 'one', title: 'One Fish' } };

    expect(search(options, 'cat')).toBeUndefined();
  });

  it('flattens an OptionsCollection down to a single matching item when flattenWhenSingleChild is set', () => {
    const options: OptionsCollection = {
      groupA: { id: 'one', title: 'One Fish' },
      groupB: { id: 'two', title: 'Two Cat' },
    };

    expect(
      search(options, 'fish', { title: 'partial-match', flattenWhenSingleChild: true }),
    ).toEqual({ id: 'one', title: 'One Fish' });
  });
});
