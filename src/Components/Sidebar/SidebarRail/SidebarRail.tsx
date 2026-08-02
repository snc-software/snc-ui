import { cn } from '@/Utils/cn';

import { useSidebar } from '../Sidebar.context';
import { classes } from '../Sidebar.styles';

import type { SidebarRailProps } from '../Sidebar.types';

/**
 * A thin, click-to-toggle strip at the sidebar's inner edge — an alternative, always-reachable
 * affordance alongside `SidebarTrigger`. Only makes sense as a child of `Sidebar`.
 */
export default function SidebarRail({ ref, className, ...rest }: SidebarRailProps) {
  const { toggleSidebar, side } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      tabIndex={0}
      className={cn(
        classes.rail,
        side === 'left' ? classes.railLeft : classes.railRight,
        className,
      )}
      {...rest}
      onClick={() => toggleSidebar()}
    />
  );
}
