import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarMenuSubItemProps } from '../Sidebar.types';

/** A single nested sub-link's `<li>` wrapper. Only makes sense as a child of `SidebarMenuSub`. */
export default function SidebarMenuSubItem({
  ref,
  className,
  children,
  ...rest
}: SidebarMenuSubItemProps) {
  return (
    <li ref={ref} className={cn(classes.menuSubItem, className)} {...rest}>
      {children}
    </li>
  );
}
