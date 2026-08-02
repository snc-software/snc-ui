import { cn } from '@/Utils/cn';

import { classes } from '../Sidebar.styles';

import type { SidebarMenuSubButtonProps } from '../Sidebar.types';
import type { Ref } from 'react';

/**
 * The clickable row for a single nested sub-link — same `href`-vs-`button` idiom as
 * `SidebarMenuButton`, smaller and without an icon slot. Only makes sense as a child of
 * `SidebarMenuSubItem`.
 */
export default function SidebarMenuSubButton({
  ref,
  isActive = false,
  href,
  onClick,
  disabled = false,
  className,
  children,
  ...rest
}: SidebarMenuSubButtonProps) {
  const buttonClassName = cn(
    classes.menuSubButtonBase,
    isActive && classes.menuSubButtonActive,
    className,
  );

  if (href !== undefined) {
    return (
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
    );
  }

  return (
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
}
