import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarMenuBadgeProps } from '../Sidebar.types';

/**
 * A small muted count/label anchored to a nav item's right edge (e.g. an unread count). Only
 * makes sense as a child of `SidebarMenuItem`.
 */
export default function SidebarMenuBadge({
  ref,
  className,
  children,
  ...rest
}: SidebarMenuBadgeProps) {
  return (
    <div ref={ref} className={cn(classes.menuBadge, className)} {...rest}>
      {children}
    </div>
  );
}
