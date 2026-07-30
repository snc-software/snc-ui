import { NavArrowDown } from 'iconoir-react';

import { cn } from '@/Utils/cn';

import { Sizes, Variants } from './Select.constants';
import { classes } from './Select.styles';

import type { SelectProps } from './Select.types';

export default function Select({
  ref,
  options,
  size = 'md',
  hasError = false,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <span className={cn(classes.wrapper, className)}>
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(classes.select, Variants[hasError ? 'error' : 'default'], Sizes[size])}
        {...rest}
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={classes.chevron} aria-hidden="true">
        <NavArrowDown width={16} height={16} />
      </span>
    </span>
  );
}
