import { useEffect, useLayoutEffect, useState } from 'react';

import { cn } from '@/Utils/cn';

import { SIDEBAR_KEYBOARD_SHORTCUT } from '../Sidebar.constants';
import { SidebarContext } from '../Sidebar.context';
import { createSidebarStore } from '../Sidebar.store';
import { classes } from '../Sidebar.styles';
import { getSidebarCookie, setSidebarCookie } from '../Sidebar.utils';
import { useIsMobile } from '../useIsMobile';

import type { SidebarProviderProps } from '../Sidebar.types';

/**
 * Owns the shared sidebar state (open/collapsed, mobile sheet, viewport) and distributes it via
 * `useSidebar()` to every `Sidebar` sub-component, including ones outside `Sidebar`'s own DOM
 * subtree (e.g. a `SidebarTrigger` in a page header, `SidebarInset` as a sibling of `Sidebar`).
 * Wraps the whole app-shell region — `Sidebar` and its main content both render inside it.
 */
export default function SidebarProvider({
  ref,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  className,
  style,
  children,
  ...rest
}: SidebarProviderProps) {
  const [store] = useState(() =>
    createSidebarStore(controlledOpen ?? getSidebarCookie() ?? defaultOpen),
  );
  const isMobile = useIsMobile();

  // Keeps the store's `isMobile` in sync with the real viewport, read by `toggleSidebar` to decide
  // whether a toggle should flip `open` (desktop) or `openMobile` (mobile sheet).
  useLayoutEffect(() => {
    store.getState().setIsMobile(isMobile);
  }, [store, isMobile]);

  // Controlled mode: whenever the consumer's own `open` prop changes, push it into the store so
  // every reader sees it immediately, without the store needing to know it's being controlled.
  useLayoutEffect(() => {
    if (controlledOpen !== undefined) {
      store.getState().setOpen(controlledOpen);
    }
  }, [store, controlledOpen]);

  // Persists every `open` change to the cookie and notifies a controlling consumer, regardless of
  // whether the change came from a click, the keyboard shortcut, or the controlled-sync effect
  // above.
  useEffect(() => {
    let previousOpen = store.getState().open;

    return store.subscribe((state) => {
      if (state.open !== previousOpen) {
        previousOpen = state.open;
        setSidebarCookie(state.open);
        onOpenChange?.(state.open);
      }
    });
  }, [store, onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        store.getState().toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  return (
    <SidebarContext value={store}>
      <div ref={ref} className={cn(classes.provider, className)} style={style} {...rest}>
        {children}
      </div>
    </SidebarContext>
  );
}
