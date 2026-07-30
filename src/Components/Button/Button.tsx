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
      {isLoading && (
        <>
          <svg className={classes.spinner} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              className="snc:opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="snc:opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className={classes.srOnly}>Loading</span>
        </>
      )}
      {children}
    </button>
  );
}
