import { cn } from '@/Utils/cn';

import { classes } from './IconButton.styles';

import type { IconButtonProps } from './IconButton.types';

export default function IconButton({
  ref,
  children,
  label,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(classes.button, className)}
      {...rest}
      type="button"
    >
      {children}
    </button>
  );
}
