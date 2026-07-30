import { useState } from 'react';

import Button from '@/Components/Button';
import Select from '@/Components/Select';
import { cn } from '@/Utils/cn';

import { classes } from './TableDropdownFilterMenu.styles';

import type { TableDropdownFilterMenuProps } from './TableDropdownFilterMenu.types';

/**
 * Option-list filter panel for a column. Only meaningful inside `TableHeadCell`'s filter popover.
 *
 * Mirrors `TableInputFilterMenu`'s shape — a control above Search / Clear / Cancel — so both filter
 * types read the same way. The source library instead applied a dropdown choice immediately, with no
 * buttons at all; the two panels were reconciled on the design side in favour of this one.
 */
export default function TableDropdownFilterMenu({
  columnId,
  title,
  options,
  isClearable = true,
  filters,
  onClose,
  onFiltersSet,
  onFiltersCleared,
  className,
  ...rest
}: TableDropdownFilterMenuProps) {
  const activeFilter = filters.find((filter) => filter.id === columnId);
  const [value, setValue] = useState<string | undefined>(
    activeFilter?.value === undefined ? undefined : String(activeFilter.value),
  );

  const canSearch = value !== undefined && value.length > 0;
  const canClear = activeFilter !== undefined || canSearch;

  const submit = () => {
    if (!canSearch) {
      return;
    }

    const option = options.find((candidate) => candidate.value === value);

    onFiltersSet([{ id: columnId, title, text: option?.label, value }]);
    onClose();
  };

  // Leaves the popover open, matching `TableInputFilterMenu` — clearing is normally the first half of
  // choosing something else.
  const handleClear = () => {
    setValue(undefined);

    if (activeFilter) {
      onFiltersCleared([columnId]);
    }
  };

  return (
    <div className={cn(classes.base, className)} {...rest}>
      <Select
        className={classes.select}
        aria-label={`Filter by ${title.toLowerCase()}`}
        placeholder={`Select ${title.toLowerCase()}`}
        options={options}
        value={value ?? ''}
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
