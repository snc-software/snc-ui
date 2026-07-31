import { useState } from 'react';

import Button from '@/Components/Button';
import Select from '@/Components/Select';
import { cn } from '@/Utils/cn';

import { classes } from './TableDropdownFilterMenu.styles';

import type { TableDropdownFilterMenuProps } from './TableDropdownFilterMenu.types';

/**
 * Option-list filter panel for a column. Only meaningful inside `TableHeadCell`'s filter popover.
 *
 * Mirrors `TableInputFilterMenu`'s shape so both filter types read the same way. The source applied a
 * dropdown choice immediately with no buttons; reconciled on the design side in favour of this.
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

  // Stays open, matching TableInputFilterMenu.
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
