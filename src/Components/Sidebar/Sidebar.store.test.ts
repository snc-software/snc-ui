import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createSidebarStore } from './Sidebar.store';

describe('createSidebarStore', () => {
  it('initializes open to the supplied defaultOpen and openMobile to false', () => {
    const store = createSidebarStore(true);

    expect(store.getState().open).toBe(true);
    expect(store.getState().openMobile).toBe(false);
  });

  it('setOpen accepts a direct boolean value', () => {
    const store = createSidebarStore(true);

    act(() => store.getState().setOpen(false));

    expect(store.getState().open).toBe(false);
  });

  it('setOpen accepts an updater function', () => {
    const store = createSidebarStore(true);

    act(() => store.getState().setOpen((prev) => !prev));

    expect(store.getState().open).toBe(false);
  });

  it('setOpenMobile updates openMobile without touching open', () => {
    const store = createSidebarStore(true);

    act(() => store.getState().setOpenMobile(true));

    expect(store.getState().openMobile).toBe(true);
    expect(store.getState().open).toBe(true);
  });

  it('setConfig updates side/variant/collapsible together', () => {
    const store = createSidebarStore(true);

    act(() => store.getState().setConfig({ side: 'right', variant: 'inset', collapsible: 'icon' }));

    expect(store.getState().side).toBe('right');
    expect(store.getState().variant).toBe('inset');
    expect(store.getState().collapsible).toBe('icon');
  });

  it('toggleSidebar flips open when isMobile is false', () => {
    const store = createSidebarStore(true);

    act(() => store.getState().toggleSidebar());

    expect(store.getState().open).toBe(false);
    expect(store.getState().openMobile).toBe(false);
  });

  it('toggleSidebar flips openMobile instead of open when isMobile is true', () => {
    const store = createSidebarStore(true);

    act(() => store.getState().setIsMobile(true));
    act(() => store.getState().toggleSidebar());

    expect(store.getState().openMobile).toBe(true);
    expect(store.getState().open).toBe(true);
  });

  it('keeps state fully independent across two separate instances', () => {
    const first = createSidebarStore(true);
    const second = createSidebarStore(true);

    act(() => first.getState().setOpen(false));

    expect(second.getState().open).toBe(true);
  });
});
