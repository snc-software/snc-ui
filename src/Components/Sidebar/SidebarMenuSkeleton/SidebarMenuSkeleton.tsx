import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarMenuSkeletonProps } from '../Sidebar.types';

/** A pulsing placeholder row, shown in place of a `SidebarMenuButton` while nav items are loading. */
export default function SidebarMenuSkeleton({
  ref,
  hasIcon = true,
  className,
  ...rest
}: SidebarMenuSkeletonProps) {
  return (
    <div ref={ref} className={cn(classes.skeleton, className)} {...rest}>
      {hasIcon && <div className={classes.skeletonIcon} />}
      <div className={classes.skeletonText} />
    </div>
  );
}
