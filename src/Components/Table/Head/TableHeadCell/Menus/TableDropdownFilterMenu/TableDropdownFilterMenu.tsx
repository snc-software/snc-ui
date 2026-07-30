import { useRef, useState } from 'react';

import { cn } from '@/Utils/cn';

import { classes } from './TableDropdownFilterMenu.styles';

import type { TableDropdownFilterMenuProps } from './TableDropdownFilterMenu.types';
import type { KeyboardEvent } from 'react';

const ClearOptionValue = '';

/**
 * Single-select option list for a column filter. Only meaningful inside `TableHeadCell`'s popover.
 *
 * Implemented as a listbox with roving tabindex rather than a stack of buttons so arrow keys move
 * between options the way assistive technology expects of a single-select list.
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
  const selectedValue = activeFilter?.value === undefined ? undefined : String(activeFilter.value);

  const selectableOptions = isClearable
    ? [{ value: ClearOptionValue, label: 'All' }, ...options]
    : options;

  const initialIndex = Math.max(
    0,
    selectableOptions.findIndex((option) => option.value === selectedValue),
  );
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const select = (value: string) => {
    if (value === ClearOptionValue) {
      onFiltersCleared([columnId]);
      onClose();
      return;
    }

    const option = selectableOptions.find((candidate) => candidate.value === value);

    onFiltersSet([{ id: columnId, title, text: option?.label, value }]);
    onClose();
  };

  const moveFocus = (nextIndex: number) => {
    const clamped = (nextIndex + selectableOptions.length) % selectableOptions.length;

    setFocusedIndex(clamped);
    optionRefs.current[clamped]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number, value: string) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveFocus(selectableOptions.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(value);
    }
  };

  return (
    <div className={cn(classes.base, className)} {...rest}>
      <ul role="listbox" aria-label={`Filter by ${title.toLowerCase()}`} className={classes.list}>
        {selectableOptions.map((option, index) => {
          const isSelected =
            option.value === ClearOptionValue
              ? selectedValue === undefined
              : option.value === selectedValue;

          return (
            <li
              key={option.value || 'all'}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              role="option"
              aria-selected={isSelected}
              tabIndex={index === focusedIndex ? 0 : -1}
              className={cn(
                classes.option,
                isSelected && classes.optionSelected,
                option.value === ClearOptionValue && classes.clearOption,
              )}
              onClick={() => select(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index, option.value)}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
