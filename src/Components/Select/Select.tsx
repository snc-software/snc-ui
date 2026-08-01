import { NavArrowDown } from 'iconoir-react';
import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';

import InputLabel from '@/Internal/InputLabel';
import Popout from '@/Internal/Popout';
import { cn } from '@/Utils/cn';

import {
  ChevronSize,
  DefaultPlaceholder,
  DefaultVisibleOptions,
  OptionRowHeightRem,
  OptionSizes,
  Sizes,
  Variants,
} from './Select.constants';
import { classes } from './Select.styles';

import type { SelectProps } from './Select.types';
import type { KeyboardEvent } from 'react';

/**
 * Single-select dropdown with a custom options panel.
 *
 * Deliberately not a native `<select>`: a browser's own dropdown is drawn by the OS and cannot take
 * the design system's colours, type or spacing, so the panel is rendered and positioned here instead.
 * It follows the ARIA listbox pattern — a `combobox` trigger owning a `listbox` popup — with focus
 * moving into the options while open so arrow keys, Home/End and type-ahead-free selection behave the
 * way assistive technology expects.
 */
export default function Select({
  ref,
  id,
  options,
  label,
  value,
  defaultValue,
  onChange,
  placeholder = DefaultPlaceholder,
  size = 'md',
  hasError = false,
  visibleOptions = DefaultVisibleOptions,
  name,
  disabled = false,
  className,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Controlled as soon as `value` is supplied, as a native input would be.
  const selectedValue = value ?? uncontrolledValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  /**
   * Walks `step` options at a time from `from`, wrapping around, and returns the first that is not
   * disabled — so disabled options are skipped rather than trapping the keyboard on them.
   */
  const findEnabledIndex = (from: number, step: number) => {
    const { length } = options;

    for (let offset = 1; offset <= length; offset += 1) {
      const index = (((from + step * offset) % length) + length) % length;

      if (!options[index].disabled) {
        return index;
      }
    }

    return -1;
  };

  const close = (shouldReturnFocus: boolean) => {
    setIsOpen(false);

    if (shouldReturnFocus) {
      triggerRef.current?.focus();
    }
  };

  const open = () => {
    const selectedIndex = options.findIndex((option) => option.value === selectedValue);
    const isSelectedUsable = selectedIndex !== -1 && !options[selectedIndex].disabled;

    setFocusedIndex(isSelectedUsable ? selectedIndex : findEnabledIndex(-1, 1));
    setIsOpen(true);
  };

  const select = (index: number) => {
    const option = options[index];

    if (!option || option.disabled) {
      return;
    }

    if (value === undefined) {
      setUncontrolledValue(option.value);
    }

    onChange?.(option.value);
    close(true);
  };

  // Focus follows the highlight so the browser scrolls it into view and AT announces it.
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    optionRefs.current[focusedIndex]?.focus();
  }, [isOpen, focusedIndex]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Enter/Space left to the button's native click, else the panel opens twice.
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedIndex(findEnabledIndex(index, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedIndex(findEnabledIndex(index, -1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setFocusedIndex(findEnabledIndex(-1, 1));
    } else if (event.key === 'End') {
      event.preventDefault();
      setFocusedIndex(findEnabledIndex(options.length, -1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(index);
      // Escape is Popout's, so only the topmost panel closes.
    } else if (event.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div className={cn(classes.wrapper, className)}>
      {label !== undefined && <InputLabel htmlFor={triggerId}>{label}</InputLabel>}

      <button
        ref={setTriggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? `${triggerId}-listbox` : undefined}
        aria-invalid={hasError || undefined}
        disabled={disabled}
        className={cn(
          classes.trigger,
          Variants[hasError ? 'error' : 'default'],
          Sizes[size],
          isOpen ? classes.triggerOpen : classes.triggerClosed,
        )}
        onClick={() => (isOpen ? close(false) : open())}
        onKeyDown={handleTriggerKeyDown}
        {...rest}
      >
        <span className={classes.value}>
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className={classes.placeholder}>{placeholder}</span>
          )}
        </span>
        <span className={cn(classes.chevron, isOpen && classes.chevronOpen)} aria-hidden="true">
          <NavArrowDown width={ChevronSize} height={ChevronSize} />
        </span>
      </button>

      {/* Carries the selection into the surrounding form. */}
      {name !== undefined && <input type="hidden" name={name} value={selectedValue ?? ''} />}

      <Popout
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={() => setIsOpen(false)}
        className={classes.panel}
        style={{ maxHeight: `${OptionRowHeightRem * visibleOptions}rem` }}
      >
        <ul id={`${triggerId}-listbox`} role="listbox" aria-labelledby={triggerId}>
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              role="option"
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled || undefined}
              tabIndex={index === focusedIndex ? 0 : -1}
              className={cn(
                classes.option,
                OptionSizes[size],
                option.value === selectedValue && classes.optionSelected,
                option.disabled && classes.optionDisabled,
              )}
              onClick={() => select(index)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </Popout>
    </div>
  );
}
