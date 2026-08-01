import Spinner from '@/Components/Spinner';
import { cn } from '@/Utils/cn';

import { IconPositions, Variants } from './Button.constants';
import { classes } from './Button.styles';

import type { ButtonProps } from './Button.types';

export default function Button({
  ref,
  variant = 'primary',
  isLoading = false,
  icon,
  iconPosition = 'leading',
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const showIcon = icon && !isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(classes.base, Variants[variant], className)}
      {...rest}
    >
      {/* Inherits the button foreground, else primary paints raspberry on raspberry. */}
      {isLoading && <Spinner size="sm" className="snc:text-current" />}
      {showIcon && iconPosition === 'leading' && (
        <span className={cn(classes.icon, IconPositions.leading)} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {showIcon && iconPosition === 'trailing' && (
        <span className={cn(classes.icon, IconPositions.trailing)} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
}
