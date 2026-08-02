import { createContext, use } from 'react';
import { useStore } from 'zustand';

import type { SidebarStore } from './Sidebar.store';
import type { SidebarContextValue } from './Sidebar.types';

export const SidebarContext = createContext<SidebarStore | null>(null);

/**
 * Raw store accessor, for the rare consumer (`Sidebar` itself, to publish its own `side`/
 * `variant`/`collapsible` props via `setConfig`) that needs the imperative store rather than a
 * reactive `useSidebar()` snapshot. Must be called from within a `SidebarProvider`.
 */
export function useSidebarStore(): SidebarStore {
  const store = use(SidebarContext);

  if (store === null) {
    throw new Error('Sidebar sub-components must be used within a SidebarProvider.');
  }

  return store;
}

/**
 * Reads the shared sidebar state/config. Must be called from within a `SidebarProvider` — every
 * other `Sidebar` sub-component requires one, matching shadcn's own `useSidebar` guard.
 */
export function useSidebar(): SidebarContextValue {
  const store = useSidebarStore();

  const open = useStore(store, (state) => state.open);
  const openMobile = useStore(store, (state) => state.openMobile);
  const isMobile = useStore(store, (state) => state.isMobile);
  const side = useStore(store, (state) => state.side);
  const variant = useStore(store, (state) => state.variant);
  const collapsible = useStore(store, (state) => state.collapsible);
  const setOpen = useStore(store, (state) => state.setOpen);
  const setOpenMobile = useStore(store, (state) => state.setOpenMobile);
  const toggleSidebar = useStore(store, (state) => state.toggleSidebar);

  return {
    state: open ? 'expanded' : 'collapsed',
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
    side,
    variant,
    collapsible,
  };
}
