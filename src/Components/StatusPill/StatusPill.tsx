import { cn } from '@/Utils/cn';

import { Variants } from './StatusPill.constants';
import { classes } from './StatusPill.styles';

import type { StatusPillProps } from './StatusPill.types';

export default function StatusPill({
  ref,
  variant,
  className,
  children,
  ...rest
}: StatusPillProps) {
  return (
    <span ref={ref} className={cn(classes.base, Variants[variant], className)} {...rest}>
      {children}
    </span>
  );
}
