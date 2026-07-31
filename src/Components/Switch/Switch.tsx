import { useId } from 'react';

import { cn } from '@/Utils/cn';

import { Variants } from './Switch.constants';
import { classes } from './Switch.styles';

import type { SwitchProps } from './Switch.types';

export default function Switch({
  ref,
  id,
  label,
  hasError = false,
  className,
  ...rest
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <span className={cn(classes.wrapper, className)}>
      <span className={classes.track}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          className={cn(classes.input, Variants[hasError ? 'error' : 'default'])}
          {...rest}
        />
        <span className={classes.thumb} aria-hidden="true" />
      </span>
      {label !== undefined && (
        <label htmlFor={inputId} className={classes.label}>
          {label}
        </label>
      )}
    </span>
  );
}
