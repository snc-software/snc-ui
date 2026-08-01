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
} from './RangeCalendar.constants';
import { classes } from './RangeCalendar.styles';
import { isWithinRange } from './RangeCalendar.utils';

import type { RangeCalendarProps } from './RangeCalendar.types';
import type { CalendarDay, MonthYear } from '@/Utils/calendarGrid';
import type { KeyboardEvent, MutableRefObject } from 'react';

const WEEKS = 6;

function findInitialFocusIndex(cells: CalendarDay[], seedDate?: Date): number {
  if (seedDate) {
    const matched = cells.findIndex(
      (cell) => cell.origin === 'current' && isSameDay(cell.date, seedDate),
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

function monthYearValue({ year, month }: MonthYear): number {
  return year * 12 + month;
}

function clampMonthYear(value: MonthYear, min: MonthYear, max: MonthYear): MonthYear {
  if (monthYearValue(value) < monthYearValue(min)) {
    return min;
  }

  if (monthYearValue(value) > monthYearValue(max)) {
    return max;
  }

  return value;
}

type BandBounds = {
  earlier: Date;
  later: Date;
};

type MonthColumnConfig = {
  side: 'left' | 'right';
  view: MonthYear;
  cells: CalendarDay[];
  gridId: string;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  cellRefs: MutableRefObject<Array<HTMLButtonElement | null>>;
  isAtMin: boolean;
  isAtMax: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  yearOptions: { value: string; label: string }[];
};

/**
 * Two independently-navigable, Monday-first month grids — each with its own month/year `Select` and
 * Prev/Next, an exact duplicate of `Calendar`'s own nav pane, so a range can span an arbitrary number
 * of months apart rather than always exactly two consecutive ones. Works purely in terms of native
 * `Date` — string formatting, `includeTime`, and the two-click selection state machine itself belong
 * to the consumer (`DateRangePicker`); this component only reports clicks and renders whatever
 * `rangeStart`/`rangeEnd` it's given, previewing the band toward a hovered day while `rangeEnd` is
 * still unset.
 */
export default function RangeCalendar({
  id,
  rangeStart,
  rangeEnd,
  onSelect,
  minYear,
  maxYear,
  className,
  style,
  ...rest
}: RangeCalendarProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const leftGridId = `${baseId}-left`;
  const rightGridId = `${baseId}-right`;

  const { minYear: resolvedMinYear, maxYear: resolvedMaxYear } = resolveYearRange(minYear, maxYear);

  // Each side is bounded independently of the other's live position — left never reaches the global
  // max month, right never reaches the global min month — so there's always a month of room for the
  // collision auto-adjust below to land in, however far minYear/maxYear are apart.
  const leftMinBound: MonthYear = { year: resolvedMinYear, month: 0 };
  const leftMaxBound: MonthYear = addMonths({ year: resolvedMaxYear, month: 11 }, -1);
  const rightMinBound: MonthYear = addMonths({ year: resolvedMinYear, month: 0 }, 1);
  const rightMaxBound: MonthYear = { year: resolvedMaxYear, month: 11 };

  const [leftView, setLeftView] = useState<MonthYear>(() =>
    clampMonthYear(
      {
        year: rangeStart?.getFullYear() ?? new Date().getFullYear(),
        month: rangeStart?.getMonth() ?? new Date().getMonth(),
      },
      leftMinBound,
      leftMaxBound,
    ),
  );
  const [rightView, setRightView] = useState<MonthYear>(() => {
    const seeded = clampMonthYear(
      {
        year: rangeEnd?.getFullYear() ?? addMonths(leftView, 1).year,
        month: rangeEnd?.getMonth() ?? addMonths(leftView, 1).month,
      },
      rightMinBound,
      rightMaxBound,
    );

    return monthYearValue(seeded) > monthYearValue(leftView)
      ? seeded
      : clampMonthYear(addMonths(leftView, 1), rightMinBound, rightMaxBound);
  });

  const isAtLeftMin = monthYearValue(leftView) === monthYearValue(leftMinBound);
  const isAtLeftMax = monthYearValue(leftView) === monthYearValue(leftMaxBound);
  const isAtRightMin = monthYearValue(rightView) === monthYearValue(rightMinBound);
  const isAtRightMax = monthYearValue(rightView) === monthYearValue(rightMaxBound);

  const leftCells = useMemo(
    () => buildMonthGrid(leftView.year, leftView.month),
    [leftView.year, leftView.month],
  );
  const rightCells = useMemo(
    () => buildMonthGrid(rightView.year, rightView.month),
    [rightView.year, rightView.month],
  );

  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);

  const band: BandBounds | undefined = useMemo(() => {
    if (!rangeStart) {
      return undefined;
    }

    const end = rangeEnd ?? hoveredDate;

    if (!end) {
      return { earlier: rangeStart, later: rangeStart };
    }

    return rangeStart <= end
      ? { earlier: rangeStart, later: end }
      : { earlier: end, later: rangeStart };
  }, [rangeStart, rangeEnd, hoveredDate]);

  const [leftFocusedIndex, setLeftFocusedIndex] = useState(() =>
    findInitialFocusIndex(leftCells, rangeStart),
  );
  const [rightFocusedIndex, setRightFocusedIndex] = useState(() =>
    findInitialFocusIndex(rightCells, rangeEnd),
  );
  const leftCellRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rightCellRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rightHasMountedRef = useRef(false);

  // Left grid gets browser focus on mount and on every arrow-key move, matching Calendar's existing
  // behaviour (it remounts fresh each time its Popout opens). The right grid only needs this once the
  // user has already tabbed into it — see the mounted-ref guard below. Passive effects, not layout: see
  // Calendar's own focus effect for why — the ancestor Popout that owns this panel must finish
  // registering its layer (a layout effect, which runs children-before-parents) before this fires, or
  // the resulting focusin bubbles up and reads as an outside interaction.
  useEffect(() => {
    leftCellRefs.current[leftFocusedIndex]?.focus();
  }, [leftFocusedIndex]);

  useEffect(() => {
    if (!rightHasMountedRef.current) {
      rightHasMountedRef.current = true;

      return;
    }

    rightCellRefs.current[rightFocusedIndex]?.focus();
  }, [rightFocusedIndex]);

  // Independent navigation, with a same-render companion adjustment on the other side whenever a
  // change would otherwise let left land at or after right (or vice versa) — so the left panel always
  // stays strictly before the right one without dynamically filtering either side's Select options
  // against the other's live position.
  const updateLeftView = (next: MonthYear) => {
    const clampedNext = clampMonthYear(next, leftMinBound, leftMaxBound);

    setLeftView(clampedNext);
    setRightView((currentRight) =>
      monthYearValue(clampedNext) >= monthYearValue(currentRight)
        ? clampMonthYear(addMonths(clampedNext, 1), rightMinBound, rightMaxBound)
        : currentRight,
    );
  };

  const updateRightView = (next: MonthYear) => {
    const clampedNext = clampMonthYear(next, rightMinBound, rightMaxBound);

    setRightView(clampedNext);
    setLeftView((currentLeft) =>
      monthYearValue(clampedNext) <= monthYearValue(currentLeft)
        ? clampMonthYear(addMonths(clampedNext, -1), leftMinBound, leftMaxBound)
        : currentLeft,
    );
  };

  const handleMouseLeave = () => setHoveredDate(undefined);

  const monthOptions = MonthLabels.map((label, index) => ({ value: String(index), label }));
  const yearOptionsFor = (bound: { min: MonthYear; max: MonthYear }) =>
    Array.from(
      { length: bound.max.year - bound.min.year + 1 },
      (_, index) => bound.min.year + index,
    ).map((year) => ({ value: String(year), label: String(year) }));
  const leftYearOptions = yearOptionsFor({ min: leftMinBound, max: leftMaxBound });
  const rightYearOptions = yearOptionsFor({ min: rightMinBound, max: rightMaxBound });

  const renderMonthColumn = (config: MonthColumnConfig) => {
    const {
      side,
      view,
      cells,
      gridId,
      focusedIndex,
      setFocusedIndex,
      cellRefs,
      isAtMin,
      isAtMax,
      onPrev,
      onNext,
      onMonthChange,
      onYearChange,
      yearOptions,
    } = config;

    const currentMonthIndices = cells.reduce<number[]>((indices, cell, index) => {
      if (cell.origin === 'current') {
        indices.push(index);
      }

      return indices;
    }, []);
    const firstCurrentIndex = currentMonthIndices[0];
    const lastCurrentIndex = currentMonthIndices[currentMonthIndices.length - 1];

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
        onSelect(cells[index].date);
      }
    };

    return (
      <div key={side} className={classes.monthColumn}>
        <div className={classes.navPane}>
          <button
            type="button"
            aria-label={`Previous month (${side})`}
            className={classes.navButton}
            disabled={isAtMin}
            onClick={onPrev}
          >
            <NavArrowLeft width={NavIconSize} height={NavIconSize} />
          </button>

          <div className={classes.navSelectors}>
            <Select
              aria-label={`Month (${side})`}
              size="sm"
              className={classes.monthSelect}
              options={monthOptions}
              value={String(view.month)}
              onChange={onMonthChange}
            />
            <Select
              aria-label={`Year (${side})`}
              size="sm"
              className={classes.yearSelect}
              options={yearOptions}
              value={String(view.year)}
              onChange={onYearChange}
            />
          </div>

          <button
            type="button"
            aria-label={`Next month (${side})`}
            className={classes.navButton}
            disabled={isAtMax}
            onClick={onNext}
          >
            <NavArrowRight width={NavIconSize} height={NavIconSize} />
          </button>
        </div>

        <div className={classes.monthBody}>
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
            aria-label={`${MonthLabels[view.month]} ${view.year}`}
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

                  const isToday = isSameDay(day.date, new Date());
                  const isStart = band !== undefined && isSameDay(day.date, band.earlier);
                  const isEnd = band !== undefined && isSameDay(day.date, band.later);
                  const isBetween =
                    band !== undefined && isWithinRange(day.date, band.earlier, band.later);
                  const isSelected = isStart || isEnd;

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
                        isStart && DayCellVariants.boundary,
                        isStart && DayCellVariants.boundaryStart,
                        isEnd && DayCellVariants.boundary,
                        isEnd && DayCellVariants.boundaryEnd,
                        isBetween && DayCellVariants.inRange,
                      )}
                      onClick={() => onSelect(day.date)}
                      onKeyDown={(event) => handleDayKeyDown(event, index)}
                      onMouseEnter={() => setHoveredDate(day.date)}
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
  };

  return (
    <div className={cn(classes.wrapper, className)} style={style} {...rest}>
      <div className={classes.panels} onMouseLeave={handleMouseLeave}>
        {renderMonthColumn({
          side: 'left',
          view: leftView,
          cells: leftCells,
          gridId: leftGridId,
          focusedIndex: leftFocusedIndex,
          setFocusedIndex: setLeftFocusedIndex,
          cellRefs: leftCellRefs,
          isAtMin: isAtLeftMin,
          isAtMax: isAtLeftMax,
          onPrev: () => updateLeftView(addMonths(leftView, -1)),
          onNext: () => updateLeftView(addMonths(leftView, 1)),
          onMonthChange: (value) => updateLeftView({ ...leftView, month: Number(value) }),
          onYearChange: (value) => updateLeftView({ ...leftView, year: Number(value) }),
          yearOptions: leftYearOptions,
        })}
        <div className={classes.divider} aria-hidden="true" />
        {renderMonthColumn({
          side: 'right',
          view: rightView,
          cells: rightCells,
          gridId: rightGridId,
          focusedIndex: rightFocusedIndex,
          setFocusedIndex: setRightFocusedIndex,
          cellRefs: rightCellRefs,
          isAtMin: isAtRightMin,
          isAtMax: isAtRightMax,
          onPrev: () => updateRightView(addMonths(rightView, -1)),
          onNext: () => updateRightView(addMonths(rightView, 1)),
          onMonthChange: (value) => updateRightView({ ...rightView, month: Number(value) }),
          onYearChange: (value) => updateRightView({ ...rightView, year: Number(value) }),
          yearOptions: rightYearOptions,
        })}
      </div>
    </div>
  );
}
