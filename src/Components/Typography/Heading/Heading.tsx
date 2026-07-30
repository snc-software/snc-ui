import { cn } from '@/Utils/cn';

import { Sizes } from './Heading.constants';
import { classes } from './Heading.styles';

import type { HeadingProps } from './Heading.types';

export default function Heading({
  ref,
  level = 'h2',
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = level;

  return (
    <Tag ref={ref} className={cn(classes.base, Sizes[level], className)} {...rest}>
      {children}
    </Tag>
  );
}
