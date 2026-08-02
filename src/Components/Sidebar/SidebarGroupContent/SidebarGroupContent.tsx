import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarGroupContentProps } from '../Sidebar.types';

/** Wraps the group's `SidebarMenu`. Only makes sense as a child of `SidebarGroup`. */
export default function SidebarGroupContent({
  ref,
  className,
  children,
  ...rest
}: SidebarGroupContentProps) {
  return (
    <div ref={ref} className={cn(classes.groupContent, className)} {...rest}>
      {children}
    </div>
  );
}
