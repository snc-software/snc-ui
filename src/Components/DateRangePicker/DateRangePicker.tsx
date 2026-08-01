import { Calendar as CalendarIcon } from 'iconoir-react';
import { useCallback, useId, useRef, useState } from 'react';

import InputLabel from '@/Internal/InputLabel';
import Popout from '@/Internal/Popout';
import RangeCalendar from '@/Internal/RangeCalendar';
import { cn } from '@/Utils/cn';
import {
  formatDateOnly,
  formatWithEndOfDayUtc,
  formatWithMidnightUtc,
  parseIsoDate,
} from '@/Utils/isoDate';

import { DefaultPlaceholder, IconSize, Variants } from './DateRangePicker.constants';
import { classes } from './DateRangePicker.styles';
import { formatRangeDisplay } from './DateRangePicker.utils';

import type { DateRangePickerProps, DateRangePickerValue } from './DateRangePicker.types';
import type { KeyboardEvent } from 'react';

type CommittedRange = {
  start: Date | undefined;
  end: Date | undefined;
};

function parseRange(value: DateRangePickerValue | undefined): CommittedRange {
  return { start: parseIsoDate(value?.start), end: parseIsoDate(value?.end) };
}

/**
 * Text input styled like `DatePicker`, with a calendar icon button that opens a floating panel
 * showing two consecutive months (`RangeCalendar`). A first click sets a transient, uncommitted
 * `pendingStart`; a second click on or after it completes and commits the range, closing the panel —
 * no separate Apply step. A click before `pendingStart` restarts the selection instead of reordering
 * it into a valid range, and so does the very first click after reopening an already-committed range
 * (both per the same "reset" rule). Follows the WAI-ARIA Date Picker Dialog pattern, as `DatePicker`
 * does.
 */
export default function DateRangePicker({
  ref,
  id,
  label,
  value,
  defaultValue,
  onChange,
  includeTime = false,
  placeholder = DefaultPlaceholder,
  hasError = false,
  disabled = false,
  minYear,
  maxYear,
  name,
  className,
  ...rest
}: DateRangePickerProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const gridId = `${triggerId}-grid`;

  const [isOpen, setIsOpen] = useState(false);
  const [pendingStart, setPendingStart] = useState<Date | undefined>(undefined);
  const [uncontrolledRange, setUncontrolledRange] = useState<CommittedRange>(() =>
    parseRange(defaultValue),
  );

  const triggerRef = useRef<HTMLInputElement | null>(null);

  // Controlled as soon as `value` is supplied, as a native input would be.
  const committedRange = value !== undefined ? parseRange(value) : uncontrolledRange;
  const displayValue = formatRangeDisplay(committedRange.start, committedRange.end);

  const emittedStart = (date: Date) =>
    includeTime ? formatWithMidnightUtc(date) : formatDateOnly(date);
  const emittedEnd = (date: Date) =>
    includeTime ? formatWithEndOfDayUtc(date) : formatDateOnly(date);

  const setTriggerRef = useCallback(
    (node: HTMLInputElement | null) => {
      triggerRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const closeAndReset = () => {
    setIsOpen(false);
    setPendingStart(undefined);
  };

  const open = () => {
    if (disabled) {
      return;
    }

    setIsOpen(true);
  };

  const toggle = () => (isOpen ? closeAndReset() : open());

  const commitRange = (start: Date, end: Date) => {
    if (value === undefined) {
      setUncontrolledRange({ start, end });
    }

    onChange?.({ start: emittedStart(start), end: emittedEnd(end) });

    setIsOpen(false);
    setPendingStart(undefined);
    triggerRef.current?.focus();
  };

  const handleSelect = (date: Date) => {
    // No selection in progress — either a fresh open or straight after a commit/reopen (Clarification
    // 5): always starts a new selection rather than editing one end of the previous range.
    if (pendingStart === undefined) {
      setPendingStart(date);

      return;
    }

    // Out-of-order click (Clarification 4): restarts the selection instead of reordering it into a
    // valid range.
    if (date < pendingStart) {
      setPendingStart(date);

      return;
    }

    commitRange(pendingStart, date);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault();
      open();
    }
  };

  const rangeStart = pendingStart ?? committedRange.start;
  const rangeEnd = pendingStart ? undefined : committedRange.end;

  return (
    <div className={cn(classes.wrapper, className)}>
      {label !== undefined && <InputLabel htmlFor={triggerId}>{label}</InputLabel>}

      <div className={classes.inputWrapper}>
        <input
          ref={setTriggerRef}
          id={triggerId}
          type="text"
          role="combobox"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls={isOpen ? `${gridId}-left ${gridId}-right` : undefined}
          aria-invalid={hasError || undefined}
          disabled={disabled}
          className={cn(classes.input, Variants[hasError ? 'error' : 'default'])}
          onClick={toggle}
          onKeyDown={handleTriggerKeyDown}
          {...rest}
        />

        <button
          type="button"
          aria-label="Open calendar"
          className={classes.iconButton}
          disabled={disabled}
          onClick={toggle}
        >
          <CalendarIcon width={IconSize} height={IconSize} />
        </button>
      </div>

      {/* Carries the committed selection into the surrounding form. */}
      {name !== undefined && (
        <>
          <input
            type="hidden"
            name={`${name}Start`}
            value={committedRange.start ? emittedStart(committedRange.start) : ''}
          />
          <input
            type="hidden"
            name={`${name}End`}
            value={committedRange.end ? emittedEnd(committedRange.end) : ''}
          />
        </>
      )}

      <Popout
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={closeAndReset}
        hasAdaptiveWidth={false}
        className={classes.panel}
      >
        <RangeCalendar
          id={gridId}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onSelect={handleSelect}
          minYear={minYear}
          maxYear={maxYear}
        />
      </Popout>
    </div>
  );
}
