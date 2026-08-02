import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarMenuItemProps } from '../Sidebar.types';

/**
 * A single nav item's `<li>` wrapper — positions an optional `SidebarMenuAction`/
 * `SidebarMenuBadge`/`SidebarMenuSub` relative to its `SidebarMenuButton`. Only makes sense as a
 * child of `SidebarMenu`.
 */
export default function SidebarMenuItem({
  ref,
  className,
  children,
  ...rest
}: SidebarMenuItemProps) {
  return (
    <li ref={ref} className={cn(classes.menuItem, className)} {...rest}>
      {children}
    </li>
  );
}
