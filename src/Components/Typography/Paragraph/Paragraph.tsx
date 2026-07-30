import { cn } from '@/Utils/cn';

import { classes } from './Paragraph.styles';

import type { ParagraphProps } from './Paragraph.types';

export default function Paragraph({ ref, className, children, ...rest }: ParagraphProps) {
  return (
    <p ref={ref} className={cn(classes.base, className)} {...rest}>
      {children}
    </p>
  );
}
