import { cn } from '@/Utils/cn';

import { Variants } from './TextArea.constants';
import { classes } from './TextArea.styles';

import type { TextAreaProps } from './TextArea.types';

export default function TextArea({ ref, hasError = false, className, ...rest }: TextAreaProps) {
  return (
    <textarea
      ref={ref}
      aria-invalid={hasError || undefined}
      className={cn(classes.base, Variants[hasError ? 'error' : 'default'], className)}
      {...rest}
    />
  );
}
