import { Search } from 'iconoir-react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import Spinner from '@/Components/Spinner';
import InputLabel from '@/Internal/InputLabel';
import Popout from '@/Internal/Popout';
import { cn } from '@/Utils/cn';

import {
  DefaultDebounceMs,
  DefaultNoResultsMessage,
  DefaultVisibleOptions,
  IconSize,
  OptionRowHeightRem,
  OptionSizes,
  Sizes,
  Variants,
} from './SearchInput.constants';
import { classes } from './SearchInput.styles';

import type { SearchInputOption, SearchInputProps } from './SearchInput.types';
import type { KeyboardEvent } from 'react';

/**
 * Editable combobox whose options come entirely from the consumer: typing debounces internally,
 * then calls `onSearch` so the consumer can run an external lookup, and the consumer feeds the
 * results back in via `options` (plus `isLoading` while their fetch is in flight). Unlike
 * `Autocomplete`, there is no local filtering — the listbox always renders exactly what `options`
 * currently holds.
 *
 * The listbox is never opened by focus or click — only a completed search (an `options` update, or
 * `isLoading` returning to `false`, once a search has actually run) reveals it, showing either the
 * results or the no-results message. While a search is in flight, the only feedback is the spinner
 * swapped in for the prefix icon on the input itself; the panel stays closed. Follows the same
 * WAI-ARIA "Editable Combobox with List Autocomplete" pattern as `Autocomplete`, with DOM focus
 * staying on the input and the highlighted option tracked via `aria-activedescendant`.
 */
export default function SearchInput({
  ref,
  id,
  options,
  onSearch,
  debounceMs = DefaultDebounceMs,
  isLoading = false,
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
}: SearchInputProps) {
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

  /**
   * Walks `step` options at a time from `from` within `list`, wrapping around, and returns the first
   * that is not disabled — so disabled options are skipped rather than trapping the highlight.
   */
  const findEnabledIndex = (list: SearchInputOption[], from: number, step: number) => {
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

  // Adjusted during render (per https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-
  // state-when-a-prop-changes) rather than in an effect. Only re-syncs when the new value's label is
  // actually known — unlike `Autocomplete`, the full option set isn't available up front, so a value
  // that doesn't (yet) match a current option is left alone rather than guessed at.
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);

    if (value === undefined) {
      setQuery('');
    } else {
      const option = options.find((candidate) => candidate.value === value);

      if (option) {
        setQuery(option.label);
      }
    }
  }

  // Whether a search has actually run yet — the listbox must never appear just because `options`
  // happens to be non-empty at mount, only once *this* component has triggered a real search.
  const [hasSearched, setHasSearched] = useState(false);

  // `options` is replaced wholesale by every new set of search results, so a highlight index left
  // over from the previous list could point at the wrong row (or be out of bounds) once the panel
  // does open — always recomputed on change, not only while already open. A completed, non-empty-
  // or-empty result set (`hasSearched`, and not loading) is exactly what reveals the panel; this is
  // the only way it opens for a consumer who never toggles `isLoading` at all (e.g. a synchronous
  // local lookup) — the `isLoading` transition below covers the more typical async case.
  const [prevOptions, setPrevOptions] = useState(options);

  if (options !== prevOptions) {
    setPrevOptions(options);
    setHighlightedIndex(findEnabledIndex(options, -1, 1));

    if (hasSearched && !isLoading && !disabled) {
      setIsOpen(true);
    }
  }

  // Mirrors `Autocomplete`'s controlled-`value` sync technique, but for `isLoading`: closes the
  // panel the moment a new search starts, and reopens it once that search resolves (given a search
  // has actually run) — this is what makes the panel appear exactly once results are ready, for a
  // consumer following the "set isLoading true, fetch, set isLoading false + options" convention.
  const [prevIsLoading, setPrevIsLoading] = useState(isLoading);

  if (isLoading !== prevIsLoading) {
    setPrevIsLoading(isLoading);

    if (isLoading) {
      setIsOpen(false);
    } else if (hasSearched && !disabled) {
      setIsOpen(true);
    }
  }

  const triggerRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeoutRef.current);
    };
  }, []);

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

  // Focus stays on the input, so the highlighted option is scrolled into view manually rather than
  // relying on the browser's native focus-follows-scroll behaviour.
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    optionRefs.current[highlightedIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, highlightedIndex]);

  // Only reachable via `ArrowDown` while closed (see `handleTriggerKeyDown`) — there is no
  // focus/click trigger, since the panel is only ever meant to appear as the result of a completed
  // search, never merely because the user interacted with the input.
  const open = () => {
    if (disabled || isLoading || !hasSearched) {
      return;
    }

    const selectedIndex = options.findIndex((option) => option.value === selectedValue);
    const isSelectedUsable = selectedIndex !== -1 && !options[selectedIndex].disabled;

    setHighlightedIndex(isSelectedUsable ? selectedIndex : findEnabledIndex(options, -1, 1));
    setIsOpen(true);
  };

  // Closes without discarding the typed text — unlike `Autocomplete`, the text here is a search
  // query the consumer's results are keyed on, not a value expected to match a label, so there is
  // nothing safe to revert to. Used for every dismissal that isn't an explicit pick (blur, outside
  // click, Escape), all routed through `Popout`'s `onClose`.
  const close = () => {
    setIsOpen(false);
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
    setQuery(option.label);
    setIsOpen(false);
  };

  const handleInputChange = (newQuery: string) => {
    setQuery(newQuery);
    // Any previous results are now stale for the text currently shown — close immediately rather
    // than leaving them visible until the new search resolves.
    setIsOpen(false);

    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setHasSearched(true);
      onSearch(newQuery);
    }, debounceMs);
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
      setHighlightedIndex(findEnabledIndex(options, highlightedIndex, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(findEnabledIndex(options, highlightedIndex, -1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setHighlightedIndex(findEnabledIndex(options, -1, 1));
    } else if (event.key === 'End') {
      event.preventDefault();
      setHighlightedIndex(findEnabledIndex(options, options.length, -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      select(highlightedIndex);
      // Escape is Popout's, so only the topmost panel closes.
    }
  };

  const highlightedOption = options[highlightedIndex];

  return (
    <div className={cn(classes.wrapper, className)}>
      {label !== undefined && <InputLabel htmlFor={triggerId}>{label}</InputLabel>}

      <div className={classes.inputWrapper}>
        <span className={classes.prefixIcon} aria-hidden={isLoading ? undefined : 'true'}>
          {isLoading ? <Spinner size="sm" /> : <Search width={IconSize} height={IconSize} />}
        </span>

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
          aria-busy={isLoading || undefined}
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
          onKeyDown={handleTriggerKeyDown}
          {...rest}
        />
      </div>

      {/* Carries the selection into the surrounding form. */}
      {name !== undefined && <input type="hidden" name={name} value={selectedValue ?? ''} />}

      <Popout
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={close}
        className={classes.panel}
        style={{ maxHeight: `${OptionRowHeightRem * visibleOptions}rem` }}
      >
        <ul id={listboxId} role="listbox" aria-labelledby={triggerId}>
          {options.length === 0 ? (
            <li className={cn(classes.noResults, OptionSizes[size])}>{noResultsMessage}</li>
          ) : (
            options.map((option, index) => (
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
