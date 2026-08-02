import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarMenuActionProps } from '../Sidebar.types';

/**
 * A small icon-only action button anchored to a nav item's top-right corner (e.g. an overflow
 * menu trigger). Only makes sense as a child of `SidebarMenuItem`.
 */
export default function SidebarMenuAction({
  ref,
  label,
  onClick,
  isVisibleOnHover = false,
  className,
  children,
  ...rest
}: SidebarMenuActionProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        classes.menuAction,
        isVisibleOnHover && classes.menuActionVisibleOnHover,
        className,
      )}
      {...rest}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}
