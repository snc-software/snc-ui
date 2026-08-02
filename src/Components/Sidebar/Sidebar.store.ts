import { createStore } from 'zustand';

import type { SidebarCollapsible, SidebarSide, SidebarVariant } from './Sidebar.types';
import type { StoreApi } from 'zustand';

export type SidebarStoreState = {
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
  // `Sidebar`'s own side/variant/collapsible props, mirrored into the shared store so siblings
  // outside `Sidebar`'s own DOM subtree (e.g. `SidebarInset`, a page-header `SidebarTrigger`) can
  // read them via `useSidebar()` too, not just descendants `Sidebar` could prop-drill to directly.
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setOpenMobile: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setConfig: (config: {
    side: SidebarSide;
    variant: SidebarVariant;
    collapsible: SidebarCollapsible;
  }) => void;
  toggleSidebar: () => void;
};

export type SidebarStore = StoreApi<SidebarStoreState>;

export function createSidebarStore(defaultOpen: boolean): SidebarStore {
  return createStore<SidebarStoreState>()((set, get) => ({
    open: defaultOpen,
    openMobile: false,
    isMobile: false,
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',

    setOpen: (open) =>
      set((state) => ({ open: typeof open === 'function' ? open(state.open) : open })),

    setOpenMobile: (openMobile) => set({ openMobile }),

    setIsMobile: (isMobile) => set({ isMobile }),

    setConfig: (config) => set(config),

    // On mobile the sidebar renders as an off-canvas sheet gated by `openMobile`; `open` (the
    // desktop expanded/collapsed flag) is left untouched so the desktop state is preserved for
    // whenever the viewport crosses back above the breakpoint.
    toggleSidebar: () => {
      const { isMobile, setOpen, setOpenMobile, openMobile } = get();

      if (isMobile) {
        setOpenMobile(!openMobile);
      } else {
        setOpen((prev) => !prev);
      }
    },
  }));
}
