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
      {/* Overrides the spinner's primary default so it inherits the button's foreground instead —
          otherwise a primary button would paint a raspberry spinner on a raspberry background. */}
      {isLoading && <Spinner size="sm" className="snc:text-current" />}
      {children}
    </button>
  );
}
