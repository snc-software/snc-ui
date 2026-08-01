import { useState } from 'react';

import Button from '@/Components/Button';
import DatePicker from '@/Components/DatePicker';
import { cn } from '@/Utils/cn';

import { classes } from './TableDateFilterMenu.styles';

import type { TableDateFilterMenuProps } from './TableDateFilterMenu.types';

/**
 * Date filter panel for a column. Only meaningful inside `TableHeadCell`'s filter popover.
 *
 * Mirrors `TableInputFilterMenu`'s shape so every filter type reads the same way, swapping the text
 * input for a `DatePicker`.
 */
export default function TableDateFilterMenu({
  columnId,
  title,
  placeholder,
  isClearable = true,
  align = 'left',
  filters,
  onClose,
  onFiltersSet,
  onFiltersCleared,
  className,
  ...rest
}: TableDateFilterMenuProps) {
  const activeFilter = filters.find((filter) => filter.id === columnId);
  const [value, setValue] = useState<string | undefined>(activeFilter?.value as string | undefined);
  // DatePicker only ever writes into its own internal uncontrolled state while its `value` prop is
  // undefined (its first render here, absent an active filter) — once that happens, simply passing
  // `value={undefined}` again after Clear can't blank it, since it falls back to that now-stale
  // internal state. Remounting via `key` is what actually discards it.
  const [resetKey, setResetKey] = useState(0);

  const canSearch = value !== undefined;
  const canClear = activeFilter !== undefined || value !== undefined;

  const submit = () => {
    if (!canSearch) {
      return;
    }

    onFiltersSet([{ id: columnId, title, text: value, value }]);
    onClose();
  };

  // Stays open, matching TableInputFilterMenu — clearing is usually the first half of repicking.
  const handleClear = () => {
    setValue(undefined);
    setResetKey((key) => key + 1);

    if (activeFilter) {
      onFiltersCleared([columnId]);
    }
  };

  return (
    <div className={cn(classes.base, className)} {...rest}>
      <DatePicker
        key={resetKey}
        className={classes.picker}
        aria-label={`Filter by ${title.toLowerCase()}`}
        placeholder={placeholder}
        align={align}
        value={value}
        onChange={setValue}
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
