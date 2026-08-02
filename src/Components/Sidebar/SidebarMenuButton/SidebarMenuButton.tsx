import Tooltip from '@/Components/Tooltip';
import { cn } from '@/Utils/cn';

import { Sizes } from '../Sidebar.constants';
import { useSidebar } from '../Sidebar.context';
import { classes } from '../Sidebar.styles';

import type { SidebarMenuButtonProps } from '../Sidebar.types';
import type { Ref } from 'react';

/**
 * The clickable row for a single nav item. Renders a real `<a href>` when `href` is supplied, a
 * `<button>` otherwise — the same idiom `ComplexNavigationMenu` uses. When the parent `Sidebar` is
 * icon-collapsed on desktop, wraps itself in a `Tooltip` showing `tooltip` (if supplied) so the
 * item's label is still discoverable.
 */
export default function SidebarMenuButton({
  ref,
  size = 'md',
  isActive = false,
  href,
  onClick,
  tooltip,
  disabled = false,
  className,
  children,
  ...rest
}: SidebarMenuButtonProps) {
  const { state, collapsible, side, isMobile } = useSidebar();
  const isCollapsedToIcon = !isMobile && collapsible === 'icon' && state === 'collapsed';

  const buttonClassName = cn(
    classes.menuButtonBase,
    Sizes[size],
    isActive && classes.menuButtonActive,
    isCollapsedToIcon && classes.menuButtonCollapsedIcon,
    className,
  );

  const content =
    href !== undefined ? (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled}
        className={buttonClassName}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        {...rest}
      >
        {children}
      </a>
    ) : (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        aria-current={isActive ? 'page' : undefined}
        className={buttonClassName}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );

  if (!isCollapsedToIcon || tooltip === undefined) {
    return content;
  }

  return (
    <Tooltip content={tooltip} placement={side === 'left' ? 'right' : 'left'}>
      {content}
    </Tooltip>
  );
}
