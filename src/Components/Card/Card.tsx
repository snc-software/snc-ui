import { cn } from '@/Utils/cn';

import { Variants } from './Card.constants';
import { classes } from './Card.styles';

import type { CardProps } from './Card.types';

export default function Card({
  ref,
  header,
  content,
  actions,
  actionsAlign = 'right',
  className,
  ...rest
}: CardProps) {
  return (
    <div ref={ref} className={cn(classes.root, className)} {...rest}>
      {header !== undefined && <div className={classes.header}>{header}</div>}
      {content !== undefined && <div className={classes.content}>{content}</div>}
      {actions !== undefined && (
        <div className={cn(classes.actions, Variants[actionsAlign])}>{actions}</div>
      )}
    </div>
  );
}
