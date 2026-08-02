import { Search } from 'iconoir-react';
import { useEffect, useId, useRef, useState } from 'react';

import Modal from '@/Components/Modal';
import OptionsList from '@/Components/OptionsList';
import Spinner from '@/Components/Spinner';
import { cn } from '@/Utils/cn';

import { classes } from './CmdK.styles';
import { flattenOptionItems, getAdjacentEnabledId } from './CmdK.utils';

import type { CmdKProps } from './CmdK.types';
import type { KeyboardEvent } from 'react';

const IconSize = 18;

/**
 * A search-driven command palette rendered inside `Modal`, modelled on shadcn's `Command`/
 * `CommandDialog`. Renders results entirely via `OptionsList` — the same recursive,
 * groupable options engine ported from the legacy library's `OptionsList`/`MultiSelectDropdown` — but
 * always with `checkbox={false}` and `selected={[]}`, so every activation (click or `Enter`) yields
 * exactly one id with nothing to "un-toggle" afterwards. Activating an item calls its own `onClick`
 * (resolved via `flattenOptionItems`) and then closes the palette; filtering is entirely external,
 * via the debounced `onSearch`, mirroring `SearchInput`.
 */
export default function CmdK({
  ref,
  isOpen,
  onClose,
  options,
  onSearch,
  debounceMs = 300,
  isLoading = false,
  placeholder = 'Search...',
  emptyText = 'No results found',
  closeLabel = 'Close',
  className,
  ...rest
}: CmdKProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(() => getAdjacentEnabledId(options, null, 1));

  // Whether a search has actually run yet — mirrors `SearchInput`'s own `hasSearched` gate, so an
  // empty `options` array at mount (no search performed) renders nothing rather than a premature
  // `emptyText`.
  const [hasSearched, setHasSearched] = useState(false);

  // `options` is replaced wholesale by every new set of search results, so a highlight left over
  // from the previous list could point at a stale/missing item — recomputed during render (per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // rather than in an effect, so there is no in-between render with a dangling `activeId`.
  const [prevOptions, setPrevOptions] = useState(options);

  if (options !== prevOptions) {
    setPrevOptions(options);
    setActiveId(getAdjacentEnabledId(options, null, 1));
  }

  useEffect(() => {
    return () => clearTimeout(searchTimeoutRef.current);
  }, []);

  // Clears the typed query once the palette closes, adjusted during render rather than in an effect
  // — see `OptionItem.tsx` for the same technique and its rationale.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);

    if (!isOpen) {
      setQuery('');
      setHasSearched(false);
    }
  }

  // CmdK renders `<Modal>`, so it is Modal's ancestor in the tree — its effects fire after Modal's
  // own layout effect that focuses the panel, letting the search input win final focus instead.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleActivate = (selectedIds: string[]) => {
    const id = selectedIds[0];

    if (id === undefined) {
      return;
    }

    const item = flattenOptionItems(options).find((option) => option.id === id);
    item?.onClick?.();
    onClose();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);

    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setHasSearched(true);
      onSearch(value);
    }, debounceMs);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveId(getAdjacentEnabledId(options, activeId, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveId(getAdjacentEnabledId(options, activeId, -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();

      if (activeId !== null) {
        handleActivate([activeId]);
      }
      // Escape is Modal's own — it closes the topmost dialog itself.
    }
  };

  const hasOptions = flattenOptionItems(options).length > 0;
  const showResults = !isLoading && (hasOptions || hasSearched);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeLabel={closeLabel}
      aria-label="Command palette"
      className={cn(classes.panel, className)}
      {...rest}
    >
      <div className={classes.searchRow}>
        <span className={classes.prefixIcon} aria-hidden={isLoading ? undefined : 'true'}>
          {isLoading ? <Spinner size="sm" /> : <Search width={IconSize} height={IconSize} />}
        </span>

        <input
          ref={setInputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={activeId ?? undefined}
          aria-busy={isLoading || undefined}
          aria-label="Command palette search"
          placeholder={placeholder}
          value={query}
          className={classes.input}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div
        id={listboxId}
        role="listbox"
        aria-label="Results"
        className={cn(classes.listbox, showResults && classes.listboxContent)}
      >
        {showResults && (
          <OptionsList
            activeId={activeId}
            checkbox={false}
            emptyText={emptyText}
            onChange={handleActivate}
            options={options}
            selectAll={false}
            selected={[]}
          />
        )}
      </div>
    </Modal>
  );
}
