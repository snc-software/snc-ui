import { describe, expect, it } from 'vitest';

import { formatRangeDisplay } from './DateRangePicker.utils';

describe('DateRangePicker.utils', () => {
  describe('formatRangeDisplay', () => {
    it('joins the formatted start and end dates with an en dash', () => {
      expect(formatRangeDisplay(new Date(2026, 6, 1), new Date(2026, 6, 15))).toBe(
        '2026-07-01 – 2026-07-15',
      );
    });

    it('returns an empty string when the start is missing', () => {
      expect(formatRangeDisplay(undefined, new Date(2026, 6, 15))).toBe('');
    });

    it('returns an empty string when the end is missing', () => {
      expect(formatRangeDisplay(new Date(2026, 6, 1), undefined)).toBe('');
    });
  });
});
