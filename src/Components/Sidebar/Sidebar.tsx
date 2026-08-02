import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/Utils/cn';

import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SIDEBAR_WIDTH_MOBILE } from './Sidebar.constants';
import { useSidebar, useSidebarStore } from './Sidebar.context';
import { classes } from './Sidebar.styles';
import { getFocusableElements } from './Sidebar.utils';
import SidebarTrigger from './SidebarTrigger';

import type { SidebarProps } from './Sidebar.types';

/**
 * The sidebar itself. Renders as a fixed-position `<aside>` on desktop (width/visibility driven by
 * `state`/`collapsible`) and as a portalled, edge-anchored off-canvas sheet on mobile (driven by
 * `openMobile`) — reusing `Modal`'s own focus-trap/Escape/backdrop-click idiom so it behaves like
 * every other overlay in this library.
 */
export default function Sidebar({
  ref,
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  triggerPlacement,
  className,
  style,
  children,
  ...rest
}: SidebarProps) {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const isCollapsedToIcon = !isMobile && collapsible === 'icon' && state === 'collapsed';

  const triggerRegionClassName = cn(
    classes.triggerRegion,
    side === 'left' && classes.triggerRegionSideLeft,
    isCollapsedToIcon && classes.triggerRegionCollapsed,
  );
  const store = useSidebarStore();

  useLayoutEffect(() => {
    store.getState().setConfig({ side, variant, collapsible });
  }, [store, side, variant, collapsible]);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpenMobile(false), [setOpenMobile]);

  useLayoutEffect(() => {
    if (!isMobile || !openMobile) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [isMobile, openMobile]);

  useEffect(() => {
    if (!isMobile || !openMobile) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const panel = panelRef.current;
      const focusable = panel ? getFocusableElements(panel) : [];

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, openMobile, close]);

  if (isMobile) {
    if (!openMobile) {
      return null;
    }

    return createPortal(
      // Backdrop is a pointer-only convenience — Escape (handled above) is its keyboard
      // equivalent. `currentTarget` check means only a genuine backdrop click closes it.
      // eslint-disable-next-line jsx-a11y-x/click-events-have-key-events, jsx-a11y-x/no-static-element-interactions
      <div
        className={classes.sheetOverlay}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          style={{ width: SIDEBAR_WIDTH_MOBILE, ...style }}
          className={cn(
            classes.sheetPanel,
            side === 'left' ? classes.sheetPanelLeft : classes.sheetPanelRight,
            className,
          )}
          {...rest}
        >
          {triggerPlacement === 'top' && (
            <div className={triggerRegionClassName}>
              <SidebarTrigger />
            </div>
          )}
          {children}
          {triggerPlacement === 'bottom' && (
            <div className={triggerRegionClassName}>
              <SidebarTrigger />
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  }

  const isCollapsed = state === 'collapsed';
  const width =
    isCollapsed && collapsible === 'icon'
      ? SIDEBAR_WIDTH_ICON
      : isCollapsed && collapsible === 'offcanvas'
        ? '0px'
        : SIDEBAR_WIDTH;

  return (
    <aside
      ref={ref}
      style={{ width, ...style }}
      className={cn(
        classes.root,
        side === 'left' ? classes.rootSideLeft : classes.rootSideRight,
        variant === 'floating' && classes.rootVariantFloating,
        variant === 'inset' && classes.rootVariantInset,
        className,
      )}
      {...rest}
    >
      {triggerPlacement === 'top' && (
        <div className={triggerRegionClassName}>
          <SidebarTrigger />
        </div>
      )}
      {children}
      {triggerPlacement === 'bottom' && (
        <div className={triggerRegionClassName}>
          <SidebarTrigger />
        </div>
      )}
    </aside>
  );
}
