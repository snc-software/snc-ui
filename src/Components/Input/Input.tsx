import { useId } from 'react';

import InputLabel from '@/Internal/InputLabel';
import { cn } from '@/Utils/cn';

import { Variants } from './Input.constants';
import { classes } from './Input.styles';

import type { InputProps } from './Input.types';

export default function Input({
  ref,
  id,
  label,
  hasError = false,
  type = 'text',
  className,
  ...rest
}: InputProps) {
  const generatedId = useId();
  // Only generated when something needs to point at it (i.e. a label is rendered) — otherwise `id`
  // stays exactly what the consumer passed, including `undefined`, so unlabelled usage is unchanged.
  const inputId = label !== undefined ? (id ?? generatedId) : id;

  const input = (
    <input
      ref={ref}
      id={inputId}
      type={type}
      aria-invalid={hasError || undefined}
      className={cn(
        classes.base,
        Variants[hasError ? 'error' : 'default'],
        label === undefined && className,
      )}
      {...rest}
    />
  );

  if (label === undefined) {
    return input;
  }

  return (
    <div className={cn(classes.wrapper, className)}>
      <InputLabel htmlFor={inputId}>{label}</InputLabel>
      {input}
    </div>
  );
}
