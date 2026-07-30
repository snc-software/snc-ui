import { cn } from '@/Utils/cn';

import { Sizes } from './Spinner.constants';
import { classes } from './Spinner.styles';

import type { SpinnerProps } from './Spinner.types';

export default function Spinner({
  ref,
  size = 'md',
  label = 'Loading',
  className,
  ...rest
}: SpinnerProps) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(classes.base, className)}
      {...rest}
    >
      <svg
        className={cn(classes.svg, Sizes[size])}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className={classes.track}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={classes.head}
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </span>
  );
}
