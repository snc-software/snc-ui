import { useState } from 'react';

import { Paragraph } from '@/Components/Typography';
import { cn } from '@/Utils/cn';

import { isOptionItem, isOptionsArray, isOptionsCollection, isOptionsGroup } from './optionChecker';
import OptionItem from './OptionItem';
import OptionsCollection from './OptionsCollection';
import OptionsGroup from './OptionsGroup';
import { search } from './OptionsList.search';
import { classes } from './OptionsList.styles';
import { filterSelectedOptions, getIndent, getOptionsIds } from './OptionsList.utils';

import type { OptionsListProps } from './OptionsList.types';

/**
 * Recursive polymorphic dispatcher: renders a plain array, a leaf `OptionItem`, a collapsible
 * `OptionsGroup`, or a `Tag`-headed `OptionsCollection`, depending on the shape of `options` at each
 * level. Ported from the legacy library's own `OptionsList`, including its checkbox multi-select
 * engine (`checkbox`/`selectAll`/`selected`/`onChange`/`selectedOnly`) and internal
 * `searchTerm`/`searchOptions` filtering.
 *
 * Has no single root DOM element of its own — like the legacy original, it dispatches straight to
 * whichever sub-component matches, or a bare fragment for an array — so `className`/`style`/`id` only
 * have a consistent place to land on the one branch that always renders a real element: the empty
 * state.
 */
export default function OptionsList({
  activeId = null,
  checkbox = true,
  className,
  defaultNestedExpanded,
  emptyText = 'No results found.',
  id,
  indent = 0,
  onChange,
  options,
  searchOptions,
  searchTerm,
  selectAll = false,
  selected,
  selectedOnly,
  style,
  title,
  ...rest
}: OptionsListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(selected ?? []);

  // Mirrors the legacy engine's own `selected`-sync behaviour, adjusted during render rather than in
  // an effect — see `OptionItem.tsx` for the same technique and its rationale.
  const [prevSelected, setPrevSelected] = useState(selected);

  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setSelectedIds(selected ?? []);
  }

  // Ported verbatim from the legacy library, including its quirk of syncing state from the
  // pre-toggle `selectedIds` rather than the computed `selectedIdsCopy` — `onChange` still receives
  // the correct, fully-toggled array, so this only matters for a genuinely uncontrolled consumer.
  const onChildItemSelectedToggled = (optionId: string) => {
    const selectedIdsCopy = selectedIds.slice(0);

    if (selectedIdsCopy.includes(optionId)) {
      selectedIdsCopy.splice(selectedIdsCopy.indexOf(optionId), 1);
    } else {
      selectedIdsCopy.push(optionId);
    }

    setSelectedIds(selectedIds);
    onChange?.(selectedIdsCopy);
  };

  const onSelectedSubOptionsChanged = (subOptionsIds: string[], subSelected: string[]) => {
    const selectedIdsCopy = selectedIds.slice(0);

    subOptionsIds.forEach((groupOptionId) => {
      if (selectedIdsCopy.includes(groupOptionId) && !subSelected.includes(groupOptionId)) {
        selectedIdsCopy.splice(selectedIdsCopy.indexOf(groupOptionId), 1);
      } else if (!selectedIdsCopy.includes(groupOptionId) && subSelected.includes(groupOptionId)) {
        selectedIdsCopy.push(groupOptionId);
      }
    });

    setSelectedIds(selectedIdsCopy);
    onChange?.(selectedIdsCopy);
  };

  const onSelectedGroupedOptionsChanged = (groupSelected: string[]) => {
    setSelectedIds(groupSelected);
    onChange?.(groupSelected);
  };

  const displayOptions = selectedOnly ? filterSelectedOptions(options, selectedIds) : options;
  const matchingOptions = displayOptions ? search(displayOptions, searchTerm, searchOptions) : undefined;

  if (matchingOptions !== undefined) {
    if (isOptionsArray(matchingOptions) && matchingOptions.length) {
      return (
        <>
          {matchingOptions.map((subOptions, index) => {
            const subOptionsIds = getOptionsIds(subOptions);

            return (
              <OptionsList
                activeId={activeId}
                checkbox={checkbox}
                defaultNestedExpanded={defaultNestedExpanded}
                indent={getIndent(indent, subOptions)}
                key={index}
                onChange={(subSelected) => onSelectedSubOptionsChanged(subOptionsIds, subSelected)}
                options={subOptions}
                selectAll={selectAll}
                selected={selectedIds.filter((selectedId) => subOptionsIds.includes(selectedId))}
                title={title}
              />
            );
          })}
        </>
      );
    }

    if (isOptionItem(matchingOptions)) {
      return (
        <OptionItem
          {...matchingOptions}
          checkbox={checkbox}
          indent={indent}
          isActive={activeId === matchingOptions.id}
          onChange={() => onChildItemSelectedToggled(matchingOptions.id)}
          selected={selectedIds.includes(matchingOptions.id)}
        />
      );
    }

    if (isOptionsGroup(matchingOptions)) {
      const childOptionsIds = getOptionsIds(matchingOptions.childOptions);

      return (
        <OptionsGroup
          {...matchingOptions}
          activeId={activeId}
          checkbox={checkbox}
          defaultNestedExpanded={defaultNestedExpanded}
          indent={indent}
          onSelectionChange={(subSelected) => onSelectedSubOptionsChanged(childOptionsIds, subSelected)}
          selectAll={selectAll}
          selectedOptions={selectedIds.filter((selectedId) => childOptionsIds.includes(selectedId))}
          title={title ? title : matchingOptions.title}
        />
      );
    }

    if (isOptionsCollection(matchingOptions)) {
      return (
        <OptionsCollection
          activeId={activeId}
          checkbox={checkbox}
          defaultNestedExpanded={defaultNestedExpanded}
          indent={indent}
          onChange={onSelectedGroupedOptionsChanged}
          options={matchingOptions}
          selectAll={selectAll}
          selected={selected}
          title={title}
        />
      );
    }
  }

  if (selectedOnly) {
    return null;
  }

  return (
    <Paragraph id={id} className={cn(classes.empty, className)} style={style} {...rest}>
      {emptyText}
    </Paragraph>
  );
}
