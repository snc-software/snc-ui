import { useId, useMemo, useState } from 'react';

import OptionsList from '../OptionsList';
import { getOptionsIds } from '../OptionsList.utils';
import OptionsGroupButton from './OptionsGroup.Button';

import type { OptionsGroupProps } from './OptionsGroup.types';

export default function OptionsGroup({
  activeId,
  checkbox = true,
  childOptions,
  defaultNestedExpanded = false,
  description,
  disabled,
  indent = 0,
  onSelectionChange,
  prefix,
  selectAll = false,
  selectedOptions,
  title,
}: OptionsGroupProps) {
  const headerId = useId();
  const panelId = useId();

  const [isChildItemsVisible, setIsChildItemsVisible] = useState(defaultNestedExpanded);
  const [currentSelectedOptions, setCurrentSelectedOptions] = useState<string[]>(selectedOptions ?? []);

  // Mirrors the legacy engine's own `selectedOptions`-sync behaviour, adjusted during render rather
  // than in an effect — see `OptionItem.tsx` for the same technique and its rationale.
  const [prevSelectedOptions, setPrevSelectedOptions] = useState(selectedOptions);

  if (selectedOptions !== prevSelectedOptions) {
    setPrevSelectedOptions(selectedOptions);
    setCurrentSelectedOptions(selectedOptions ?? []);
  }

  const childOptionIds = useMemo(() => getOptionsIds(childOptions), [childOptions]);

  const allChildOptionsSelected = useMemo(
    () =>
      currentSelectedOptions.length === childOptionIds.length &&
      currentSelectedOptions.every((selectedId) => childOptionIds.includes(selectedId)),
    [childOptionIds, currentSelectedOptions],
  );

  // Ported verbatim, including the quirk that a header click is a no-op while `selectAll` is `true`
  // — that mode has no chevron for the user to expand/collapse with either (see `OptionsGroup.Button`).
  const toggleChildItemsVisibility = () => {
    if (disabled || selectAll) {
      return;
    }

    setIsChildItemsVisible(!isChildItemsVisible);
  };

  const toggleSelectAllOptions = () => {
    const next = allChildOptionsSelected ? [] : childOptionIds;

    setCurrentSelectedOptions(next);
    onSelectionChange?.(next);
  };

  const handleSelectedOptionsChange = (selected: string[]) => {
    setCurrentSelectedOptions(selected);
    onSelectionChange?.(selected);
  };

  return (
    <div>
      <OptionsGroupButton
        allSelected={allChildOptionsSelected}
        checkbox={checkbox}
        childOptions={childOptions}
        description={description}
        disabled={disabled}
        headerId={headerId}
        indent={indent}
        isChildItemsVisible={isChildItemsVisible}
        onToggleChildVisibility={toggleChildItemsVisibility}
        onToggleSelectAll={toggleSelectAllOptions}
        panelId={panelId}
        prefix={prefix}
        selectAll={selectAll}
        selectedOptionIds={currentSelectedOptions}
        title={title}
      />

      <div id={panelId} role="region" aria-labelledby={headerId} hidden={!isChildItemsVisible}>
        <OptionsList
          activeId={activeId}
          checkbox={checkbox}
          indent={indent + 1}
          onChange={handleSelectedOptionsChange}
          options={childOptions}
          selected={currentSelectedOptions}
        />
      </div>
    </div>
  );
}
