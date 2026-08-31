import { cn } from '@/Utils/cn';

import { Variants } from './Skeleton.constants';
import { classes } from './Skeleton.styles';

import type { SkeletonProps } from './Skeleton.types';

export default function Skeleton({ ref, shape = 'text', className, ...rest }: SkeletonProps) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(classes.base, Variants[shape], className)}
      {...rest}
    />
  );
}
