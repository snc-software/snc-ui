import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarGroupActionProps } from '../Sidebar.types';

/**
 * A small icon-only action button anchored to the group's top-right corner (e.g. "add item to this
 * group"). Only makes sense as a child of `SidebarGroup`.
 */
export default function SidebarGroupAction({
  ref,
  label,
  onClick,
  className,
  children,
  ...rest
}: SidebarGroupActionProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(classes.groupAction, className)}
      {...rest}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}
