import { NavArrowDown } from 'iconoir-react';
import { useCallback, useId, useRef, useState } from 'react';

import OptionsList from '@/Components/OptionsList';
import InputLabel from '@/Internal/InputLabel';
import Popout from '@/Internal/Popout';
import { cn } from '@/Utils/cn';

import {
  ChevronSize,
  DefaultPlaceholder,
  DefaultVisibleOptions,
  OptionRowHeightRem,
  Sizes,
  Variants,
} from './MultiSelect.constants';
import { classes } from './MultiSelect.styles';
import { flattenOptionItems } from './MultiSelect.utils';

import type { MultiSelectProps } from './MultiSelect.types';
import type { KeyboardEvent } from 'react';

/**
 * Multi-selection dropdown styled and behaviourally shaped like `Select`, but its results panel is
 * delegated entirely to `OptionsList` in checkbox mode, per this component's own acceptance criteria.
 * `OptionItem`'s checkbox rows carry no `role="option"`, so this follows a disclosure/menu-button
 * pattern instead of `Select`'s combobox/listbox pattern: the trigger is a plain button
 * (`aria-haspopup="true"`) and the panel is a `role="group"` of independently toggleable checkboxes.
 * Unlike `Select`, the panel stays open across selections, since choosing more than one option at a
 * time is the point.
 */
export default function MultiSelect({
  ref,
  id,
  options,
  label,
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
}: MultiSelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const groupId = `${triggerId}-group`;

  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Controlled as soon as `value` is supplied, as a native input would be.
  const selectedValue = value ?? uncontrolledValue ?? [];
  const selectedOptions = flattenOptionItems(options).filter((option) =>
    selectedValue.includes(option.id),
  );

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

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  const handleSelectedChange = (selectedIds: string[]) => {
    if (value === undefined) {
      setUncontrolledValue(selectedIds);
    }

    onChange?.(selectedIds);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Enter/Space left to the button's native click, else the panel opens twice.
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  };

  return (
    <div className={cn(classes.wrapper, className)}>
      {label !== undefined && <InputLabel htmlFor={triggerId}>{label}</InputLabel>}

      <button
        ref={setTriggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={isOpen ? groupId : undefined}
        disabled={disabled}
        className={cn(
          classes.trigger,
          Variants[hasError ? 'error' : 'default'],
          Sizes[size],
          isOpen ? classes.triggerOpen : classes.triggerClosed,
        )}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        {...rest}
      >
        <span className={classes.value}>
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => option.title).join(', ')
          ) : (
            <span className={classes.placeholder}>{placeholder}</span>
          )}
        </span>
        <span className={cn(classes.chevron, isOpen && classes.chevronOpen)} aria-hidden="true">
          <NavArrowDown width={ChevronSize} height={ChevronSize} />
        </span>
      </button>

      {/* Carries the selection into the surrounding form: one hidden input per selected value,
          sharing `name` — the standard multi-value form-field convention. */}
      {name !== undefined &&
        selectedValue.map((selectedItemValue) => (
          <input key={selectedItemValue} type="hidden" name={name} value={selectedItemValue} />
        ))}

      <Popout
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={close}
        className={classes.panel}
        style={{ maxHeight: `${OptionRowHeightRem * visibleOptions}rem` }}
      >
        <div id={groupId} role="group" aria-labelledby={triggerId}>
          <OptionsList
            checkbox
            onChange={handleSelectedChange}
            options={options}
            selected={selectedValue}
          />
        </div>
      </Popout>
    </div>
  );
}
