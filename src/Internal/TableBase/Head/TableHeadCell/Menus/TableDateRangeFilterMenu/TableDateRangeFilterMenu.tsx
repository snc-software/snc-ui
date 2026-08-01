import { useState } from 'react';

import Button from '@/Components/Button';
import DateRangePicker from '@/Components/DateRangePicker';
import { cn } from '@/Utils/cn';

import { classes } from './TableDateRangeFilterMenu.styles';

import type { TableDateRangeFilterMenuProps } from './TableDateRangeFilterMenu.types';
import type { DateRangePickerValue } from '@/Components/DateRangePicker';

/**
 * Date-range filter panel for a column. Only meaningful inside `TableHeadCell`'s filter popover.
 *
 * Mirrors `TableInputFilterMenu`'s shape so every filter type reads the same way, swapping the text
 * input for a `DateRangePicker`. `DateRangePicker.onChange` only ever fires with a complete
 * `{ start, end }`, never a partial one, so there is no separate "in-progress" state to track here.
 */
export default function TableDateRangeFilterMenu({
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
}: TableDateRangeFilterMenuProps) {
  const activeFilter = filters.find((filter) => filter.id === columnId);
  const [value, setValue] = useState<DateRangePickerValue | undefined>(
    activeFilter?.value as DateRangePickerValue | undefined,
  );
  // DateRangePicker only ever writes into its own internal uncontrolled state while its `value` prop is
  // undefined (its first render here, absent an active filter) — once that happens, simply passing
  // `value={undefined}` again after Clear can't blank it, since it falls back to that now-stale
  // internal state. Remounting via `key` is what actually discards it.
  const [resetKey, setResetKey] = useState(0);

  const canSearch = value?.start !== undefined && value?.end !== undefined;
  const canClear = activeFilter !== undefined || value !== undefined;

  const submit = () => {
    if (!canSearch || !value) {
      return;
    }

    onFiltersSet([{ id: columnId, title, text: `${value.start} – ${value.end}`, value }]);
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
      <DateRangePicker
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
