import { useId } from 'react';

import InputLabel from '@/Internal/InputLabel';
import { cn } from '@/Utils/cn';

import { Variants } from './TextArea.constants';
import { classes } from './TextArea.styles';

import type { TextAreaProps } from './TextArea.types';

export default function TextArea({
  ref,
  id,
  label,
  hasError = false,
  className,
  ...rest
}: TextAreaProps) {
  const generatedId = useId();
  // Only generated when something needs to point at it (i.e. a label is rendered) — otherwise `id`
  // stays exactly what the consumer passed, including `undefined`, so unlabelled usage is unchanged.
  const textareaId = label !== undefined ? (id ?? generatedId) : id;

  const textarea = (
    <textarea
      ref={ref}
      id={textareaId}
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
    return textarea;
  }

  return (
    <div className={cn(classes.wrapper, className)}>
      <InputLabel htmlFor={textareaId}>{label}</InputLabel>
      {textarea}
    </div>
  );
}
