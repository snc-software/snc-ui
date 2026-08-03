import { Fragment, useState } from 'react';

import Tag from '@/Components/Tag';

import OptionsList from '../OptionsList';
import { BASE_PADDING_PX, INDENT_STEP_PX } from '../OptionsList.constants';
import { getIndent, getOptionsIds } from '../OptionsList.utils';
import { classes } from './OptionsCollection.styles';

import type { OptionsCollectionProps } from './OptionsCollection.types';

export default function OptionsCollection({
  activeId,
  checkbox = true,
  defaultNestedExpanded = false,
  indent = 0,
  onChange,
  options,
  selectAll = false,
  selected,
  title,
}: OptionsCollectionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(selected ?? []);

  // Mirrors the legacy engine's own `selected`-sync behaviour, adjusted during render rather than in
  // an effect — see `OptionItem.tsx` for the same technique and its rationale.
  const [prevSelected, setPrevSelected] = useState(selected);

  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setSelectedIds(selected ?? []);
  }

  const onSelectedGroupOptionsChanged = (groupOptionsIds: string[], groupSelected: string[]) => {
    const selectedIdsCopy = selectedIds.slice(0);

    groupOptionsIds.forEach((groupOptionId) => {
      if (selectedIdsCopy.includes(groupOptionId) && !groupSelected.includes(groupOptionId)) {
        selectedIdsCopy.splice(selectedIdsCopy.indexOf(groupOptionId), 1);
      } else if (
        !selectedIdsCopy.includes(groupOptionId) &&
        groupSelected.includes(groupOptionId)
      ) {
        selectedIdsCopy.push(groupOptionId);
      }
    });

    setSelectedIds(selectedIdsCopy);
    onChange?.(selectedIdsCopy);
  };

  return (
    <>
      {Object.entries(options).map(([key, value]) => {
        const groupOptionsIds = getOptionsIds(value);

        return (
          <Fragment key={key}>
            <div
              className={classes.heading}
              style={{ paddingLeft: `${BASE_PADDING_PX + INDENT_STEP_PX * indent}px` }}
            >
              <Tag>{key}</Tag>
            </div>
            <OptionsList
              activeId={activeId}
              checkbox={checkbox}
              defaultNestedExpanded={defaultNestedExpanded}
              indent={getIndent(indent, value)}
              onChange={(groupSelected) =>
                onSelectedGroupOptionsChanged(groupOptionsIds, groupSelected)
              }
              options={value}
              selectAll={selectAll}
              selected={selectedIds.filter((selectedId) => groupOptionsIds.includes(selectedId))}
              title={title}
            />
          </Fragment>
        );
      })}
    </>
  );
}
