import { cn } from '@/Utils/cn';

import { classes } from './NavigationBar.styles';

import type { NavigationBarProps } from './NavigationBar.types';

export default function NavigationBar({
  ref,
  brand,
  navigationMenu,
  actions,
  className,
  ...rest
}: NavigationBarProps) {
  return (
    <header ref={ref} className={cn(classes.root, className)} {...rest}>
      <div className={classes.leading}>{brand}</div>
      {navigationMenu !== undefined && <div className={classes.center}>{navigationMenu}</div>}
      {actions !== undefined && <div className={classes.trailing}>{actions}</div>}
    </header>
  );
}
