import { NavArrowDown } from 'iconoir-react';
import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/Utils/cn';
import { useAnchoredPosition } from '@/Utils/useAnchoredPosition';
import { useClickOutside } from '@/Utils/useClickOutside';

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
  const listRef = useRef<HTMLUListElement | null>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Controlled as soon as `value` is supplied, mirroring how a native input behaves, so a consumer can
  // pick either mode without the component holding a competing copy of the state.
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

  const position = useAnchoredPosition({ isOpen, triggerRef });

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

  // The panel is portalled to `document.body`, so it sits outside the DOM subtree of whatever contains
  // this Select. An ancestor running its own dismissal logic — the table's filter popover, say — would
  // therefore read a click on an option as a click outside itself and close, taking the Select with
  // it. Stopping these at the panel keeps the portal's DOM position from leaking into ancestor
  // dismissal: the panel is logically part of the Select, wherever React chose to mount it. Native
  // listeners rather than React handlers because the ancestor's listeners are native and on
  // `document`, so propagation has to be stopped in the real DOM, not in React's synthetic tree.
  //
  // Must be a layout effect declared above the focus effect below: layout effects run in declaration
  // order, and the focus one fires a `focusin` that would otherwise escape before this is listening.
  useLayoutEffect(() => {
    const panel = listRef.current;

    if (!panel) {
      return;
    }

    const stop = (event: Event) => event.stopPropagation();

    panel.addEventListener('pointerdown', stop);
    panel.addEventListener('focusin', stop);

    return () => {
      panel.removeEventListener('pointerdown', stop);
      panel.removeEventListener('focusin', stop);
    };
  }, [isOpen]);

  // Focus follows the highlighted option so the browser handles scrolling it into view, and so screen
  // readers announce each option as it is reached.
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    optionRefs.current[focusedIndex]?.focus();
  }, [isOpen, focusedIndex]);

  useClickOutside([listRef, triggerRef], () => setIsOpen(false), isOpen);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Enter and Space are left to the button's native click behaviour rather than handled here,
    // otherwise the panel would be opened twice.
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
    } else if (event.key === 'Escape') {
      event.preventDefault();
      // Escape closes this panel only. Without stopping here it would keep travelling up to any
      // ancestor listening for its own dismissal — the table's filter popover — and close that too.
      // Handled through React rather than a native listener on the panel, because React's delegated
      // listener sits on the portal container: stopping the native event any earlier would prevent
      // React from ever dispatching to this handler.
      event.stopPropagation();
      close(true);
    } else if (event.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div className={cn(classes.wrapper, className)}>
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

      {/* Mirrors the selection into the surrounding form, which the button trigger cannot do itself. */}
      {name !== undefined && <input type="hidden" name={name} value={selectedValue ?? ''} />}

      {isOpen &&
        createPortal(
          <ul
            ref={listRef}
            id={`${triggerId}-listbox`}
            role="listbox"
            aria-labelledby={triggerId}
            className={classes.panel}
            style={{ ...position, maxHeight: `${OptionRowHeightRem * visibleOptions}rem` }}
          >
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
          </ul>,
          document.body,
        )}
    </div>
  );
}
