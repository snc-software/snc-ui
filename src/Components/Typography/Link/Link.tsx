import { cn } from '@/Utils/cn';

import { classes } from './Link.styles';

import type { LinkProps } from './Link.types';

export default function Link({ ref, href, target, rel, className, children, ...rest }: LinkProps) {
  const computedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={computedRel}
      className={cn(classes.base, className)}
      {...rest}
    >
      {children}
    </a>
  );
}
