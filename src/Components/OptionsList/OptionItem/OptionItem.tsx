import { useState } from 'react';

import Checkbox from '@/Components/Checkbox';
import { cn } from '@/Utils/cn';

import { BASE_PADDING_PX, INDENT_STEP_PX } from '../OptionsList.constants';
import { classes } from './OptionItem.styles';

import type { OptionItemProps } from './OptionItem.types';

/**
 * `checkbox` picks the row's root element rather than nesting an interactive `<a>`/`<button>`
 * inside the `<label>` a checked row uses — a `<label>` only reliably forwards clicks to its own
 * associated control, and a second interactive descendant inside it is both non-standard and
 * inconsistent across browsers. `checkbox={false}` consumers (e.g. `CmdK`) never need the
 * label/checkbox pairing, so they get a single real `<a>`/`<button>` instead.
 */
export default function OptionItem({
  checkbox = true,
  className,
  description,
  disabled,
  href,
  id,
  indent = 0,
  isActive = false,
  onChange,
  prefix,
  selected,
  style,
  suffix,
  title,
  // Destructured only to keep it out of the DOM `...rest` spread below — the domain `onClick` is
  // resolved and invoked once, by `CmdK`, via `flattenOptionItems`, never by this row directly.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick,
  ...rest
}: OptionItemProps) {
  const [isSelected, setIsSelected] = useState(selected ?? false);

  // Mirrors the legacy engine's own `selected`-sync behaviour, adjusted during render (per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // rather than in an effect, so there is no extra render before the consumer-owned `selected` prop
  // takes effect.
  const [prevSelected, setPrevSelected] = useState(selected);

  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setIsSelected(selected ?? false);
  }

  const handleToggle = () => {
    setIsSelected(!isSelected);
    onChange?.(!isSelected);
  };

  const rowStyle = { paddingLeft: `${BASE_PADDING_PX + INDENT_STEP_PX * indent}px`, ...style };

  const content = (
    <>
      {prefix}
      <span className={classes.content}>
        <span className={cn(classes.title, isSelected && classes.titleSelected)}>{title}</span>
        {Array.isArray(description)
          ? description.map((line, index) => (
              <span key={index} className={classes.description}>
                {line}
              </span>
            ))
          : typeof description === 'string'
            ? <span className={classes.description}>{description}</span>
            : description?.({ selected: isSelected, disabled })}
      </span>
      {suffix}
    </>
  );

  if (!checkbox) {
    const rowClassName = cn(
      classes.interactive,
      isActive && classes.highlighted,
      disabled && classes.disabled,
      className,
    );

    if (href !== undefined) {
      return (
        <a
          id={id}
          role="option"
          aria-selected={isActive}
          aria-disabled={disabled || undefined}
          href={disabled ? undefined : href}
          className={rowClassName}
          style={rowStyle}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }

            handleToggle();
          }}
          {...rest}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        type="button"
        id={id}
        role="option"
        aria-selected={isActive}
        disabled={disabled}
        className={rowClassName}
        style={rowStyle}
        onClick={handleToggle}
        {...rest}
      >
        {content}
      </button>
    );
  }

  return (
    <label
      id={id}
      className={cn(classes.label, disabled && classes.disabled, className)}
      style={rowStyle}
      {...rest}
    >
      <Checkbox checked={isSelected} disabled={disabled} onChange={handleToggle} />
      {content}
    </label>
  );
}
