import { NavArrowDown } from 'iconoir-react';

import Checkbox from '@/Components/Checkbox';
import { cn } from '@/Utils/cn';

import { BASE_PADDING_PX, INDENT_STEP_PX } from '../OptionsList.constants';
import { classes } from './OptionsGroup.styles';

import type { OptionsGroupButtonProps } from './OptionsGroup.types';

/**
 * Sub-component of `OptionsGroup` — only makes sense as its header, never used standalone.
 *
 * Ported from the legacy library's `OptionsGroup.Button.tsx`, including its quirk that the select-
 * all checkbox shows `indeterminate` unconditionally while `selectAll` is `true` (not only when
 * partially selected), and that the collapse chevron is hidden entirely in that same mode.
 */
export default function OptionsGroupButton({
  allSelected,
  checkbox = true,
  description,
  disabled,
  headerId,
  indent = 0,
  isChildItemsVisible,
  onToggleChildVisibility,
  onToggleSelectAll,
  panelId,
  prefix,
  selectAll = false,
  selectedOptionIds,
  title,
}: OptionsGroupButtonProps) {
  return (
    <div
      className={cn(classes.header, disabled && classes.disabled)}
      style={{ paddingLeft: `${BASE_PADDING_PX + INDENT_STEP_PX * indent}px` }}
    >
      {checkbox && (
        <Checkbox
          checked={allSelected}
          disabled={disabled}
          indeterminate={(!!selectedOptionIds.length && !allSelected) || selectAll}
          onChange={onToggleSelectAll}
          aria-label={`Select all ${title}`}
        />
      )}
      <button
        type="button"
        id={headerId}
        aria-expanded={isChildItemsVisible}
        aria-controls={panelId}
        disabled={disabled}
        className={classes.headerButton}
        onClick={onToggleChildVisibility}
      >
        {prefix}
        <span className={classes.content}>
          <span className={cn(classes.title, !!selectedOptionIds.length && classes.titleActive)}>
            {title}
          </span>
          {Array.isArray(description)
            ? description.map((line, index) => (
                <span key={index} className={classes.description}>
                  {line}
                </span>
              ))
            : typeof description === 'string'
              ? <span className={classes.description}>{description}</span>
              : description?.({ selected: !!selectedOptionIds.length, disabled })}
        </span>
        {!selectAll && (
          <span
            className={cn(classes.chevron, isChildItemsVisible && classes.chevronOpen)}
            aria-hidden="true"
          >
            <NavArrowDown width={18} height={18} />
          </span>
        )}
      </button>
    </div>
  );
}
