import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarMenuProps } from '../Sidebar.types';

/** The `<ul>` root of a nav group's item list. Only makes sense as a child of `SidebarGroupContent`. */
export default function SidebarMenu({ ref, className, children, ...rest }: SidebarMenuProps) {
  return (
    <ul ref={ref} className={cn(classes.menu, className)} {...rest}>
      {children}
    </ul>
  );
}
