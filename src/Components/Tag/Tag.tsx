import { cn } from '@/Utils/cn';

import { classes } from './Tag.styles';

import type { TagProps } from './Tag.types';

export default function Tag({ ref, className, children, ...rest }: TagProps) {
  return (
    <span ref={ref} className={cn(classes.base, className)} {...rest}>
      {children}
    </span>
  );
}
