import { describe, expect, it } from 'vitest';

import { addMonths, buildMonthGrid, resolveYearRange } from './calendarGrid';

describe('calendarGrid', () => {
  describe('buildMonthGrid', () => {
    it('returns exactly 42 cells for a given year/month', () => {
      expect(buildMonthGrid(2026, 6)).toHaveLength(42);
    });

    it('starts each week on Monday and ends on Sunday', () => {
      const grid = buildMonthGrid(2026, 6);

      for (let week = 0; week < 6; week += 1) {
        expect(grid[week * 7].date.getDay()).toBe(1);
        expect(grid[week * 7 + 6].date.getDay()).toBe(0);
      }
    });

    it('leads into the previous month when the 1st falls after Monday', () => {
      // October 2023 starts on a Sunday, so the grid must lead in with 6 days of September.
      const grid = buildMonthGrid(2023, 9);

      expect(grid[0].date).toEqual(new Date(2023, 8, 25));
      expect(grid[0].origin).toBe('previous');
      expect(grid[6].origin).toBe('current');
    });

    it('has no leading days when the month starts on a Monday', () => {
      // May 2023 starts on a Monday.
      const grid = buildMonthGrid(2023, 4);

      expect(grid[0].date).toEqual(new Date(2023, 4, 1));
      expect(grid[0].origin).toBe('current');
    });

    it('trails into the next month to fill the remaining cells', () => {
      const grid = buildMonthGrid(2023, 9);
      const lastCell = grid[grid.length - 1];

      expect(lastCell.origin).toBe('next');
      expect(lastCell.date.getMonth()).toBe(10);
    });

    it('includes all 29 days of a leap-year February', () => {
      const grid = buildMonthGrid(2024, 1);
      const currentMonthDays = grid.filter((cell) => cell.origin === 'current');

      expect(currentMonthDays).toHaveLength(29);
      expect(currentMonthDays.at(-1)?.date.getDate()).toBe(29);
    });

    it('includes only 28 days of a non-leap-year February', () => {
      const grid = buildMonthGrid(2023, 1);
      const currentMonthDays = grid.filter((cell) => cell.origin === 'current');

      expect(currentMonthDays).toHaveLength(28);
      expect(currentMonthDays.at(-1)?.date.getDate()).toBe(28);
    });

    it('flags each cell with whether it belongs to the previous, current, or next month', () => {
      const grid = buildMonthGrid(2023, 9);
      const origins = new Set(grid.map((cell) => cell.origin));

      expect(origins).toEqual(new Set(['previous', 'current', 'next']));
    });
  });

  describe('resolveYearRange', () => {
    it('defaults to current year - 20 / + 10 when neither bound is supplied', () => {
      const currentYear = new Date().getFullYear();

      expect(resolveYearRange()).toEqual({
        minYear: currentYear - 20,
        maxYear: currentYear + 10,
      });
    });

    it('respects an explicitly supplied minYear independently of maxYear', () => {
      const currentYear = new Date().getFullYear();

      expect(resolveYearRange(2000)).toEqual({
        minYear: 2000,
        maxYear: currentYear + 10,
      });
    });

    it('respects an explicitly supplied maxYear independently of minYear', () => {
      const currentYear = new Date().getFullYear();

      expect(resolveYearRange(undefined, 2050)).toEqual({
        minYear: currentYear - 20,
        maxYear: 2050,
      });
    });
  });

  describe('addMonths', () => {
    it('rolls over from December to January, incrementing the year', () => {
      expect(addMonths({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 });
    });

    it('rolls over from January to December, decrementing the year', () => {
      expect(addMonths({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 });
    });

    it('adds months within the same year without changing it', () => {
      expect(addMonths({ year: 2026, month: 5 }, 2)).toEqual({ year: 2026, month: 7 });
    });
  });
});
