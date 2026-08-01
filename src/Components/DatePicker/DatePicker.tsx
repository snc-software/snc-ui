import { Calendar as CalendarIcon } from 'iconoir-react';
import { useCallback, useId, useRef, useState } from 'react';

import Calendar from '@/Internal/Calendar';
import InputLabel from '@/Internal/InputLabel';
import Popout from '@/Internal/Popout';
import { cn } from '@/Utils/cn';
import { formatDateOnly, formatWithMidnightUtc, parseIsoDate } from '@/Utils/isoDate';

import { DefaultPlaceholder, IconSize, Variants } from './DatePicker.constants';
import { classes } from './DatePicker.styles';

import type { DatePickerProps } from './DatePicker.types';
import type { KeyboardEvent } from 'react';

/**
 * Text input styled like `Input`, with a calendar icon button that opens a floating month-view
 * `Calendar`. The trigger is a real, read-only `<input>` (not a button, unlike `Select`) so it keeps
 * `Input`'s exact look and text semantics, following the WAI-ARIA Date Picker Dialog pattern.
 */
export default function DatePicker({
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
  align = 'left',
  minYear,
  maxYear,
  name,
  className,
  ...rest
}: DatePickerProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const gridId = `${triggerId}-grid`;

  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledDate, setUncontrolledDate] = useState<Date | undefined>(() =>
    parseIsoDate(defaultValue),
  );

  const triggerRef = useRef<HTMLInputElement | null>(null);

  // Controlled as soon as `value` is supplied, as a native input would be.
  const selectedDate = value !== undefined ? parseIsoDate(value) : uncontrolledDate;
  const displayValue = selectedDate ? formatDateOnly(selectedDate) : '';

  const emittedValue = (date: Date) =>
    includeTime ? formatWithMidnightUtc(date) : formatDateOnly(date);

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

  const close = (shouldReturnFocus: boolean) => {
    setIsOpen(false);

    if (shouldReturnFocus) {
      triggerRef.current?.focus();
    }
  };

  const open = () => {
    if (disabled) {
      return;
    }

    setIsOpen(true);
  };

  const toggle = () => (isOpen ? close(false) : open());

  const handleSelect = (date: Date) => {
    if (value === undefined) {
      setUncontrolledDate(date);
    }

    onChange?.(emittedValue(date));
    close(true);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault();
      open();
    }
  };

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
          aria-controls={isOpen ? gridId : undefined}
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

      {/* Carries the selection into the surrounding form. */}
      {name !== undefined && (
        <input type="hidden" name={name} value={selectedDate ? emittedValue(selectedDate) : ''} />
      )}

      <Popout
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={() => setIsOpen(false)}
        align={align}
        hasAdaptiveWidth={false}
        className={classes.panel}
      >
        <Calendar
          id={gridId}
          selectedDate={selectedDate}
          onSelect={handleSelect}
          minYear={minYear}
          maxYear={maxYear}
        />
      </Popout>
    </div>
  );
}
