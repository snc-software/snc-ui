import { cn } from '@/Utils/cn';

import { useSidebar } from '../Sidebar.context';
import { classes } from '../Sidebar.styles';

import type { SidebarMenuSubProps } from '../Sidebar.types';

/**
 * A nested, indented `<ul>` of sub-links beneath a `SidebarMenuButton`. Hidden (via the native
 * `hidden` attribute, matching `Accordion`'s own hidden-panel idiom) while the sidebar is
 * icon-collapsed — a sub-menu has no meaningful presentation with no visible parent label. Only
 * makes sense as a child of `SidebarMenuItem`.
 */
export default function SidebarMenuSub({ ref, className, children, ...rest }: SidebarMenuSubProps) {
  const { state, collapsible, isMobile } = useSidebar();
  const isCollapsedToIcon = !isMobile && collapsible === 'icon' && state === 'collapsed';

  return (
    <ul ref={ref} hidden={isCollapsedToIcon} className={cn(classes.menuSub, className)} {...rest}>
      {children}
    </ul>
  );
}
