import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useClickOutside } from './useClickOutside';

import type { RefObject } from 'react';

function mountElement() {
  const element = document.createElement('div');
  document.body.appendChild(element);

  return element;
}

function pointerDownOn(target: Node) {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true }));
}

describe('useClickOutside', () => {
  it('invokes the handler when a pointer event occurs outside the ref element', () => {
    const element = mountElement();
    const ref = { current: element } as RefObject<HTMLElement | null>;
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside([ref], onClickOutside));

    pointerDownOn(document.body);

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the handler for events inside the ref element', () => {
    const element = mountElement();
    const child = document.createElement('button');
    element.appendChild(child);
    const ref = { current: element } as RefObject<HTMLElement | null>;
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside([ref], onClickOutside));

    pointerDownOn(child);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('treats every supplied ref as inside', () => {
    const trigger = mountElement();
    const panel = mountElement();
    const refs = [{ current: trigger }, { current: panel }] as Array<RefObject<HTMLElement | null>>;
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside(refs, onClickOutside));

    pointerDownOn(panel);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('invokes the handler when focus moves outside the ref element', () => {
    const element = mountElement();
    const ref = { current: element } as RefObject<HTMLElement | null>;
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside([ref], onClickOutside));

    document.body.dispatchEvent(new Event('focusin', { bubbles: true }));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('does not listen while disabled', () => {
    const element = mountElement();
    const ref = { current: element } as RefObject<HTMLElement | null>;
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside([ref], onClickOutside, false));

    pointerDownOn(document.body);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', () => {
    const element = mountElement();
    const ref = { current: element } as RefObject<HTMLElement | null>;
    const onClickOutside = vi.fn();
    const { unmount } = renderHook(() => useClickOutside([ref], onClickOutside));

    unmount();
    pointerDownOn(document.body);

    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
