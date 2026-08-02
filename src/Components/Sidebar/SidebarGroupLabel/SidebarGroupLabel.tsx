import { cn } from '@/Utils/cn';

import { useSidebar } from '../Sidebar.context';
import { classes } from '../Sidebar.styles';

import type { SidebarGroupLabelProps } from '../Sidebar.types';

/**
 * The group's heading, in the standardised small/muted/uppercase treatment. Fades out (rather than
 * unmounting) when the sidebar is icon-collapsed, since a text label has no room in that width.
 * Only makes sense as a child of `SidebarGroup`.
 */
export default function SidebarGroupLabel({
  ref,
  className,
  children,
  ...rest
}: SidebarGroupLabelProps) {
  const { state, collapsible, isMobile } = useSidebar();
  const isCollapsedToIcon = !isMobile && collapsible === 'icon' && state === 'collapsed';

  return (
    <div
      ref={ref}
      className={cn(
        classes.groupLabel,
        isCollapsedToIcon && classes.groupLabelCollapsed,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
