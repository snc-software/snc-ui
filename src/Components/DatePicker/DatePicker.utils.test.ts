import { describe, expect, it } from 'vitest';

import { formatDateOnly, formatWithMidnightUtc, parseIsoDate } from './DatePicker.utils';

describe('DatePicker.utils', () => {
  describe('formatDateOnly', () => {
    it('formats a Date as yyyy-MM-dd, zero-padding single-digit months/days', () => {
      expect(formatDateOnly(new Date(2026, 0, 5))).toBe('2026-01-05');
    });

    it('formats a Date with double-digit month/day without extra padding', () => {
      expect(formatDateOnly(new Date(2026, 10, 21))).toBe('2026-11-21');
    });
  });

  describe('formatWithMidnightUtc', () => {
    it('formats a Date as a UTC-midnight ISO 8601 string for that calendar date', () => {
      expect(formatWithMidnightUtc(new Date(2026, 6, 31))).toBe('2026-07-31T00:00:00.000Z');
    });
  });

  describe('parseIsoDate', () => {
    it('parses a yyyy-MM-dd string into the equivalent local Date', () => {
      const parsed = parseIsoDate('2026-07-31');

      expect(parsed).toEqual(new Date(2026, 6, 31));
    });

    it('parses a full ISO datetime string, reading only its date portion', () => {
      const parsed = parseIsoDate('2026-07-31T00:00:00.000Z');

      expect(parsed).toEqual(new Date(2026, 6, 31));
    });

    it('returns undefined for an empty string', () => {
      expect(parseIsoDate('')).toBeUndefined();
    });

    it('returns undefined for a malformed string rather than throwing', () => {
      expect(parseIsoDate('not-a-date')).toBeUndefined();
    });

    it('returns undefined when passed undefined', () => {
      expect(parseIsoDate(undefined)).toBeUndefined();
    });
  });
});
