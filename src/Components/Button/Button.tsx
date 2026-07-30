import Spinner from '@/Components/Spinner';
import { cn } from '@/Utils/cn';

import { Variants } from './Button.constants';
import { classes } from './Button.styles';

import type { ButtonProps } from './Button.types';

export default function Button({
  ref,
  variant = 'primary',
  isLoading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(classes.base, Variants[variant], className)}
      {...rest}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
