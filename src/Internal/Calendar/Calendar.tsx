import { NavArrowLeft, NavArrowRight } from 'iconoir-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import Select from '@/Components/Select';
import { addMonths, buildMonthGrid, isSameDay, resolveYearRange } from '@/Utils/calendarGrid';
import { cn } from '@/Utils/cn';

import {
  DayCellVariants,
  MonthLabels,
  NavIconSize,
  WeekdayLabels,
  WeekdaySymbols,
} from './Calendar.constants';
import { classes } from './Calendar.styles';

import type { CalendarProps } from './Calendar.types';
import type { CalendarDay } from '@/Utils/calendarGrid';
import type { KeyboardEvent } from 'react';

const WEEKS = 6;

function findInitialFocusIndex(cells: CalendarDay[], selectedDate?: Date): number {
  if (selectedDate) {
    const matched = cells.findIndex(
      (cell) => cell.origin === 'current' && isSameDay(cell.date, selectedDate),
    );

    if (matched !== -1) {
      return matched;
    }
  }

  const today = new Date();
  const todayIndex = cells.findIndex(
    (cell) => cell.origin === 'current' && isSameDay(cell.date, today),
  );

  if (todayIndex !== -1) {
    return todayIndex;
  }

  return Math.max(
    cells.findIndex((cell) => cell.origin === 'current'),
    0,
  );
}

/**
 * Fixed six-week, Monday-first month grid with a navigation pane (prev/next month, plus month/year
 * `Select`s bounded by `minYear`/`maxYear`). Works purely in terms of native `Date` — string
 * formatting and the `includeTime` behaviour belong to the consumer (`DatePicker`).
 */
export default function Calendar({
  id,
  selectedDate,
  onSelect,
  minYear,
  maxYear,
  className,
  style,
  ...rest
}: CalendarProps) {
  const generatedId = useId();
  const gridId = id ?? generatedId;

  const [view, setView] = useState(() => ({
    year: selectedDate?.getFullYear() ?? new Date().getFullYear(),
    month: selectedDate?.getMonth() ?? new Date().getMonth(),
  }));
  const { year: viewYear, month: viewMonth } = view;

  const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const { minYear: resolvedMinYear, maxYear: resolvedMaxYear } = resolveYearRange(minYear, maxYear);

  // Only the requested month's days are selectable/focusable; they're always a contiguous run within
  // the fixed 42-cell grid, bounded by any leading/trailing days from adjacent months.
  const currentMonthIndices = useMemo(
    () =>
      cells.reduce<number[]>((indices, cell, index) => {
        if (cell.origin === 'current') {
          indices.push(index);
        }

        return indices;
      }, []),
    [cells],
  );
  const firstCurrentIndex = currentMonthIndices[0];
  const lastCurrentIndex = currentMonthIndices[currentMonthIndices.length - 1];

  const [focusedIndex, setFocusedIndex] = useState(() =>
    findInitialFocusIndex(cells, selectedDate),
  );
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isAtEarliestMonth = viewYear === resolvedMinYear && viewMonth === 0;
  const isAtLatestMonth = viewYear === resolvedMaxYear && viewMonth === 11;

  const monthOptions = MonthLabels.map((label, index) => ({ value: String(index), label }));
  const yearOptions = Array.from(
    { length: resolvedMaxYear - resolvedMinYear + 1 },
    (_, index) => resolvedMinYear + index,
  ).map((year) => ({ value: String(year), label: String(year) }));

  // Focuses the active cell on mount (Calendar remounts fresh each time its Popout opens) and again
  // whenever arrow-key navigation moves it. A passive effect, not layout: it must fire after the
  // enclosing Popout's own layout effect registers its layer, or the resulting focusin bubbles to an
  // ancestor Popout (nesting a Calendar inside a table filter menu, say) before that layer exists,
  // reads as an outside interaction, and closes it. Layout effects run children-before-parents, so
  // only a later, passive effect is guaranteed to run after the ancestor's registration.
  useEffect(() => {
    cellRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const goToPreviousMonth = () => {
    if (isAtEarliestMonth) {
      return;
    }

    setView((current) => addMonths(current, -1));
  };

  const goToNextMonth = () => {
    if (isAtLatestMonth) {
      return;
    }

    setView((current) => addMonths(current, 1));
  };

  const handleMonthChange = (value: string) =>
    setView((current) => ({ ...current, month: Number(value) }));

  const handleYearChange = (value: string) =>
    setView((current) => ({ ...current, year: Number(value) }));

  const handleSelect = (day: CalendarDay) => onSelect(day.date);

  const moveFocus = (from: number, delta: number) => {
    const next = from + delta;

    if (next < firstCurrentIndex || next > lastCurrentIndex) {
      return;
    }

    setFocusedIndex(next);
  };

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocus(index, 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveFocus(index, -1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(index, 7);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(index, -7);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(cells[index]);
    }
  };

  return (
    <div className={cn(classes.wrapper, className)} style={style} {...rest}>
      <div className={classes.navPane}>
        <button
          type="button"
          aria-label="Previous month"
          className={classes.navButton}
          disabled={isAtEarliestMonth}
          onClick={goToPreviousMonth}
        >
          <NavArrowLeft width={NavIconSize} height={NavIconSize} />
        </button>

        <div className={classes.navSelectors}>
          <Select
            aria-label="Month"
            size="sm"
            className={classes.monthSelect}
            options={monthOptions}
            value={String(viewMonth)}
            onChange={handleMonthChange}
          />
          <Select
            aria-label="Year"
            size="sm"
            className={classes.yearSelect}
            options={yearOptions}
            value={String(viewYear)}
            onChange={handleYearChange}
          />
        </div>

        <button
          type="button"
          aria-label="Next month"
          className={classes.navButton}
          disabled={isAtLatestMonth}
          onClick={goToNextMonth}
        >
          <NavArrowRight width={NavIconSize} height={NavIconSize} />
        </button>
      </div>

      <div className={classes.body}>
        <div className={classes.weekdayRow}>
          {WeekdayLabels.map((label, index) => (
            <span key={label} className={classes.weekdayHeader} aria-label={label}>
              {WeekdaySymbols[index]}
            </span>
          ))}
        </div>

        <div
          id={gridId}
          role="grid"
          aria-label={`${MonthLabels[viewMonth]} ${viewYear}`}
          className={classes.grid}
        >
          {Array.from({ length: WEEKS }, (_, weekIndex) => (
            <div role="row" key={weekIndex} className={classes.week}>
              {cells.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                const index = weekIndex * 7 + dayIndex;

                if (day.origin !== 'current') {
                  return (
                    <div
                      key={day.date.toISOString()}
                      aria-hidden="true"
                      className={classes.dayEmpty}
                    />
                  );
                }

                const isSelected = selectedDate !== undefined && isSameDay(day.date, selectedDate);
                const isToday = isSameDay(day.date, new Date());

                return (
                  <button
                    key={day.date.toISOString()}
                    type="button"
                    role="gridcell"
                    aria-selected={isSelected}
                    tabIndex={index === focusedIndex ? 0 : -1}
                    ref={(node) => {
                      cellRefs.current[index] = node;
                    }}
                    className={cn(
                      classes.day,
                      isToday && DayCellVariants.today,
                      isSelected && DayCellVariants.selected,
                    )}
                    onClick={() => handleSelect(day)}
                    onKeyDown={(event) => handleDayKeyDown(event, index)}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
