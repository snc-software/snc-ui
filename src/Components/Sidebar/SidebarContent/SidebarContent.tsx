import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarContentProps } from '../Sidebar.types';

/** Scrollable middle region of `Sidebar`, typically holding one or more `SidebarGroup`s. */
export default function SidebarContent({ ref, className, children, ...rest }: SidebarContentProps) {
  return (
    <div ref={ref} className={cn(classes.content, className)} {...rest}>
      {children}
    </div>
  );
}
