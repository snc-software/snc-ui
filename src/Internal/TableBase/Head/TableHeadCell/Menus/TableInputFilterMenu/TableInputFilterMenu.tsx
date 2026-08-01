import { useEffect, useRef, useState } from 'react';

import Button from '@/Components/Button';
import Input from '@/Components/Input';
import { cn } from '@/Utils/cn';

import { classes } from './TableInputFilterMenu.styles';

import type { TableInputFilterMenuProps } from './TableInputFilterMenu.types';
import type { KeyboardEvent } from 'react';

/**
 * Text filter panel for a column. Only meaningful inside `TableHeadCell`'s filter popover.
 */
export default function TableInputFilterMenu({
  columnId,
  title,
  placeholder,
  isClearable = true,
  filters,
  onClose,
  onFiltersSet,
  onFiltersCleared,
  className,
  ...rest
}: TableInputFilterMenuProps) {
  const activeFilter = filters.find((filter) => filter.id === columnId);
  const [value, setValue] = useState<string>(String(activeFilter?.value ?? ''));
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Not `autoFocus`, which lints as an anti-pattern — scoped to a menu the user just opened.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canSearch = value.trim().length > 0;
  // Typed-but-unsearched text counts, so Clear is never a no-op with text on screen.
  const canClear = activeFilter !== undefined || value.length > 0;

  const submit = () => {
    if (!canSearch) {
      return;
    }

    onFiltersSet([{ id: columnId, title, text: value, value }]);
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  // Stays open, unlike the source — clearing is usually the first half of retyping.
  const handleClear = () => {
    setValue('');

    if (activeFilter) {
      onFiltersCleared([columnId]);
    }

    inputRef.current?.focus();
  };

  return (
    <div className={cn(classes.base, className)} {...rest}>
      <Input
        ref={inputRef}
        className={classes.input}
        aria-label={`Filter by ${title.toLowerCase()}`}
        placeholder={placeholder ?? `Start typing ${title.toLowerCase()}`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={classes.actions}>
        <div className={classes.primaryActions}>
          <Button disabled={!canSearch} onClick={submit}>
            Search
          </Button>
          {isClearable && (
            <Button variant="text" disabled={!canClear} onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
