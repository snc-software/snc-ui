import { SidebarCollapse, SidebarExpand } from 'iconoir-react';

import { cn } from '@/Utils/cn';

import { useSidebar } from '../Sidebar.context';
import { classes } from '../Sidebar.styles';

import type { SidebarTriggerProps } from '../Sidebar.types';

/**
 * Toggles the sidebar open/collapsed (desktop) or open/closed (mobile sheet). Renders anywhere —
 * it doesn't need to be a descendant of `Sidebar` itself, only of `SidebarProvider`. The icon shows
 * the action a click will perform (collapse when expanded, expand when collapsed) and is mirrored
 * for a `side="right"` sidebar, since both icons are drawn assuming a left-side rail.
 */
export default function SidebarTrigger({
  ref,
  label = 'Toggle Sidebar',
  onClick,
  className,
  ...rest
}: SidebarTriggerProps) {
  const { toggleSidebar, state, side } = useSidebar();
  const Icon = state === 'collapsed' ? SidebarExpand : SidebarCollapse;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(classes.groupAction, 'snc:static', className)}
      onClick={() => {
        toggleSidebar();
        onClick?.();
      }}
      {...rest}
    >
      <Icon
        width={16}
        height={16}
        className={cn(side === 'right' && classes.triggerIconMirrored)}
      />
    </button>
  );
}
