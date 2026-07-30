import { Check, Minus } from 'iconoir-react';
import { useCallback, useId, useRef } from 'react';

import { cn } from '@/Utils/cn';

import { Variants } from './Checkbox.constants';
import { classes } from './Checkbox.styles';

import type { CheckboxProps } from './Checkbox.types';

export default function Checkbox({
  ref,
  id,
  indeterminate = false,
  label,
  hasError = false,
  className,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // `indeterminate` has no HTML attribute, so it has to be written to the DOM property. Doing it in the
  // ref callback rather than an effect keeps it applied on the same commit the node is attached, and
  // re-runs whenever `indeterminate` changes because the callback identity changes with it.
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (node) {
        node.indeterminate = indeterminate;
      }

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [indeterminate, ref],
  );

  return (
    <span className={cn(classes.wrapper, className)}>
      <span className={classes.control}>
        <input
          ref={setRefs}
          id={inputId}
          type="checkbox"
          aria-checked={indeterminate ? 'mixed' : undefined}
          className={cn(classes.input, Variants[hasError ? 'error' : 'default'])}
          {...rest}
        />
        <span
          className={cn(classes.icon, indeterminate ? classes.iconAlways : classes.iconWhenChecked)}
          aria-hidden="true"
        >
          {indeterminate ? <Minus width={12} height={12} /> : <Check width={12} height={12} />}
        </span>
      </span>
      {label !== undefined && (
        <label htmlFor={inputId} className={classes.label}>
          {label}
        </label>
      )}
    </span>
  );
}
