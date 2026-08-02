import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarGroupProps } from '../Sidebar.types';

/**
 * A standardised nav group container — every `SidebarGroup` gets the same spacing/layout
 * automatically, whichever combination of `SidebarGroupLabel`/`SidebarGroupAction`/
 * `SidebarGroupContent` it's given.
 */
export default function SidebarGroup({ ref, className, children, ...rest }: SidebarGroupProps) {
  return (
    <div ref={ref} className={cn(classes.group, className)} {...rest}>
      {children}
    </div>
  );
}
