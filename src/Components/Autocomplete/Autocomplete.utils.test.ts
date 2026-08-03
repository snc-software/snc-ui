import { describe, expect, it } from 'vitest';

import { filterOptions } from './Autocomplete.utils';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

describe('Autocomplete.utils', () => {
  describe('filterOptions', () => {
    it('returns all options when the query is empty', () => {
      expect(filterOptions(options, '')).toEqual(options);
    });

    it('returns options whose label contains the query, case-insensitively', () => {
      expect(filterOptions(options, 'AC')).toEqual([options[1]]);
    });

    it("returns an empty array when no option's label matches", () => {
      expect(filterOptions(options, 'zzz')).toEqual([]);
    });

    it('trims surrounding whitespace from the query before matching', () => {
      expect(filterOptions(options, '  active  ')).toEqual([options[1]]);
    });
  });
});
