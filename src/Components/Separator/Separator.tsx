import { cn } from '@/Utils/cn';

import { Variants } from './Separator.constants';
import { classes } from './Separator.styles';

import type { SeparatorProps } from './Separator.types';

export default function Separator({
  ref,
  orientation = 'horizontal',
  className,
  ...rest
}: SeparatorProps) {
  return (
    <hr
      ref={ref}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(classes.base, Variants[orientation], className)}
      {...rest}
    />
  );
}
