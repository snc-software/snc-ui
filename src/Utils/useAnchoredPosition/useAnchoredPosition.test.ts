import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useAnchoredPosition } from './useAnchoredPosition';

import type { RefObject } from 'react';

function triggerAt(rect: Partial<DOMRect>) {
  const element = document.createElement('button');
  element.getBoundingClientRect = () =>
    ({ bottom: 0, left: 0, right: 0, width: 0, ...rect }) as DOMRect;
  document.body.appendChild(element);

  return { current: element } as RefObject<HTMLElement | null>;
}

describe('useAnchoredPosition', () => {
  it("anchors the panel to the trigger's bottom-left edge", () => {
    const triggerRef = triggerAt({ bottom: 120, left: 40, right: 240, width: 200 });

    const { result } = renderHook(() => useAnchoredPosition({ isOpen: true, triggerRef }));

    expect(result.current).toMatchObject({ top: 120, left: 40 });
  });

  it('anchors to the right edge when align is "right"', () => {
    const triggerRef = triggerAt({ bottom: 120, left: 40, right: 240, width: 200 });
    window.innerWidth = 1000;

    const { result } = renderHook(() =>
      useAnchoredPosition({ isOpen: true, triggerRef, align: 'right' }),
    );

    expect(result.current).toMatchObject({ top: 120, right: 760 });
    expect(result.current).not.toHaveProperty('left');
  });

  it('matches the trigger width by default', () => {
    const triggerRef = triggerAt({ width: 200 });

    const { result } = renderHook(() => useAnchoredPosition({ isOpen: true, triggerRef }));

    expect(result.current).toMatchObject({ width: 200 });
  });

  it('omits the width when hasAdaptiveWidth is false', () => {
    const triggerRef = triggerAt({ width: 200 });

    const { result } = renderHook(() =>
      useAnchoredPosition({ isOpen: true, triggerRef, hasAdaptiveWidth: false }),
    );

    expect(result.current).not.toHaveProperty('width');
  });

  it('does not measure while closed', () => {
    const triggerRef = triggerAt({ bottom: 120, left: 40 });

    const { result } = renderHook(() => useAnchoredPosition({ isOpen: false, triggerRef }));

    expect(result.current).toBeUndefined();
  });

  it('re-measures on scroll so the panel tracks its trigger', () => {
    const triggerRef = triggerAt({ bottom: 120, left: 40, width: 200 });
    const { result } = renderHook(() => useAnchoredPosition({ isOpen: true, triggerRef }));

    triggerRef.current!.getBoundingClientRect = () =>
      ({ bottom: 60, left: 40, right: 240, width: 200 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toMatchObject({ top: 60 });
  });

  it('stops listening once closed', () => {
    const triggerRef = triggerAt({ bottom: 120, left: 40, width: 200 });
    const { result, rerender } = renderHook(
      ({ isOpen }) => useAnchoredPosition({ isOpen, triggerRef }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });
    triggerRef.current!.getBoundingClientRect = () =>
      ({ bottom: 999, left: 40, right: 240, width: 200 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toMatchObject({ top: 120 });
  });
});
