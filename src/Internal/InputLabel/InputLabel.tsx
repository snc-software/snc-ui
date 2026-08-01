import { cn } from '@/Utils/cn';

import { classes } from './InputLabel.styles';

import type { InputLabelProps } from './InputLabel.types';

/**
 * Standardised text label rendered just above a form control. Internal to the library — shared
 * plumbing behind `Input`/`TextArea`/`Select`/`Autocomplete`/`DatePicker`/`DateRangePicker`'s own
 * `label` prop, not something a consumer imports directly.
 */
export default function InputLabel({ ref, className, children, ...rest }: InputLabelProps) {
  return (
    <label ref={ref} className={cn(classes.base, className)} {...rest}>
      {children}
    </label>
  );
}
