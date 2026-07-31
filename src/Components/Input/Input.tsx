import { cn } from '@/Utils/cn';

import { Variants } from './Input.constants';
import { classes } from './Input.styles';

import type { InputProps } from './Input.types';

export default function Input({
  ref,
  hasError = false,
  type = 'text',
  className,
  ...rest
}: InputProps) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={hasError || undefined}
      className={cn(classes.base, Variants[hasError ? 'error' : 'default'], className)}
      {...rest}
    />
  );
}
