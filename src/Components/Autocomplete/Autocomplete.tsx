import { NavArrowDown } from 'iconoir-react';
import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

import InputLabel from '@/Internal/InputLabel';
import Popout from '@/Internal/Popout';
import { cn } from '@/Utils/cn';

import {
  ChevronSize,
  DefaultNoResultsMessage,
  DefaultVisibleOptions,
  OptionRowHeightRem,
  OptionSizes,
  Sizes,
  Variants,
} from './Autocomplete.constants';
import { classes } from './Autocomplete.styles';
import { filterOptions } from './Autocomplete.utils';

import type { AutocompleteOption, AutocompleteProps } from './Autocomplete.types';
import type { KeyboardEvent } from 'react';

/**
 * Editable combobox: a text `<input>` trigger that filters `options` as the user types and opens a
 * floating listbox of matches, per the WAI-ARIA "Editable Combobox with List Autocomplete" pattern.
 * Unlike `Select` (whose button trigger moves DOM focus into its options while open), focus
 * deliberately stays on the input the whole time so the user can keep typing — the highlighted
 * option is tracked via `aria-activedescendant` instead.
 */
export default function Autocomplete({
  ref,
  id,
  options,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  size = 'md',
  hasError = false,
  visibleOptions = DefaultVisibleOptions,
  noResultsMessage = DefaultNoResultsMessage,
  disabled = false,
  name,
  className,
  ...rest
}: AutocompleteProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const getOptionId = (index: number) => `${triggerId}-option-${index}`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  // Controlled as soon as `value` is supplied, as a native input would be.
  const selectedValue = value ?? uncontrolledValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  const [query, setQuery] = useState(() => selectedOption?.label ?? '');

  // Adjusted during render (per https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-
  // state-when-a-prop-changes) rather than in an effect, to avoid the extra render/commit an effect-
  // based sync would cost. Only re-syncs the displayed text for the controlled case — an external
  // `value` change should be reflected even if the panel never opened. Uncontrolled selections already
  // set `query` directly in `select`, so this deliberately does not read `uncontrolledValue`.
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);

    if (value !== undefined) {
      const option = options.find((candidate) => candidate.value === value);
      setQuery(option?.label ?? '');
    }
  }

  // Deliberately separate from `query`: `query` is the text shown in the input (seeded from the
  // current selection), but filtering by that seeded text on the very first open would collapse the
  // list down to just the already-selected option before the user has typed anything. `filterText`
  // starts fresh (empty, i.e. "show everything") each time the panel opens, and only tracks what's
  // been typed since.
  const [filterText, setFilterText] = useState('');

  const filteredOptions = useMemo(() => filterOptions(options, filterText), [options, filterText]);

  const triggerRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

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

  /**
   * Walks `step` options at a time from `from` within `list`, wrapping around, and returns the first
   * that is not disabled — so disabled options are skipped rather than trapping the highlight.
   */
  const findEnabledIndex = (list: AutocompleteOption[], from: number, step: number) => {
    const { length } = list;

    if (length === 0) {
      return -1;
    }

    for (let offset = 1; offset <= length; offset += 1) {
      const index = (((from + step * offset) % length) + length) % length;

      if (!list[index].disabled) {
        return index;
      }
    }

    return -1;
  };

  // Focus stays on the input, so the highlighted option is scrolled into view manually rather than
  // relying on the browser's native focus-follows-scroll behaviour.
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    optionRefs.current[highlightedIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, highlightedIndex]);

  const open = () => {
    if (disabled) {
      return;
    }

    setFilterText('');

    const selectedIndex = options.findIndex((option) => option.value === selectedValue);
    const isSelectedUsable = selectedIndex !== -1 && !options[selectedIndex].disabled;

    setHighlightedIndex(isSelectedUsable ? selectedIndex : findEnabledIndex(options, -1, 1));
    setIsOpen(true);
  };

  // Discards unmatched typed text and closes, without committing a selection. Used for every
  // dismissal that isn't an explicit pick — blur, outside click, and Escape (all routed through
  // `Popout`'s `onClose`).
  const revertAndClose = () => {
    setQuery(selectedOption?.label ?? '');
    setIsOpen(false);
  };

  const select = (index: number) => {
    const option = filteredOptions[index];

    if (!option || option.disabled) {
      return;
    }

    if (value === undefined) {
      setUncontrolledValue(option.value);
    }

    onChange?.(option.value);
    setQuery(option.label);
    setIsOpen(false);
  };

  const handleInputChange = (newQuery: string) => {
    setQuery(newQuery);
    setFilterText(newQuery);

    const nextFiltered = filterOptions(options, newQuery);
    const firstEnabled = findEnabledIndex(nextFiltered, -1, 1);

    setHighlightedIndex(firstEnabled === -1 ? 0 : firstEnabled);
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (!isOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        open();
      }

      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(findEnabledIndex(filteredOptions, highlightedIndex, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(findEnabledIndex(filteredOptions, highlightedIndex, -1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setHighlightedIndex(findEnabledIndex(filteredOptions, -1, 1));
    } else if (event.key === 'End') {
      event.preventDefault();
      setHighlightedIndex(findEnabledIndex(filteredOptions, filteredOptions.length, -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      select(highlightedIndex);
      // Escape is Popout's, so only the topmost panel closes.
    }
  };

  const highlightedOption = filteredOptions[highlightedIndex];

  return (
    <div className={cn(classes.wrapper, className)}>
      {label !== undefined && <InputLabel htmlFor={triggerId}>{label}</InputLabel>}

      <div className={classes.inputWrapper}>
        <input
          ref={setTriggerRef}
          id={triggerId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={
            isOpen && highlightedOption ? getOptionId(highlightedIndex) : undefined
          }
          aria-invalid={hasError || undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          className={cn(
            classes.input,
            Variants[hasError ? 'error' : 'default'],
            Sizes[size],
            isOpen ? classes.triggerOpen : classes.triggerClosed,
          )}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={open}
          onClick={open}
          onKeyDown={handleTriggerKeyDown}
          {...rest}
        />

        <span className={cn(classes.chevron, isOpen && classes.chevronOpen)} aria-hidden="true">
          <NavArrowDown width={ChevronSize} height={ChevronSize} />
        </span>
      </div>

      {/* Carries the selection into the surrounding form. */}
      {name !== undefined && <input type="hidden" name={name} value={selectedValue ?? ''} />}

      <Popout
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={revertAndClose}
        className={classes.panel}
        style={{ maxHeight: `${OptionRowHeightRem * visibleOptions}rem` }}
      >
        <ul id={listboxId} role="listbox" aria-labelledby={triggerId}>
          {filteredOptions.length === 0 ? (
            <li className={classes.noResults}>{noResultsMessage}</li>
          ) : (
            filteredOptions.map((option, index) => (
              // Options are deliberately not focusable — the input owns all keyboard interaction
              // (arrow keys/Enter) so typing isn't interrupted, per the WAI-ARIA editable-combobox
              // pattern. Click is a pointer-only convenience alongside that keyboard path.
              // eslint-disable-next-line jsx-a11y-x/click-events-have-key-events
              <li
                key={option.value}
                id={getOptionId(index)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={option.value === selectedValue}
                aria-disabled={option.disabled || undefined}
                className={cn(
                  classes.option,
                  OptionSizes[size],
                  index === highlightedIndex && classes.optionHighlighted,
                  option.value === selectedValue && classes.optionSelected,
                  option.disabled && classes.optionDisabled,
                )}
                onClick={() => select(index)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      </Popout>
    </div>
  );
}
