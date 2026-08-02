import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIsMobile } from './useIsMobile';

type Listener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  let listener: Listener | undefined;

  const mediaQueryList: Partial<MediaQueryList> = {
    get matches() {
      return matches;
    },
    addEventListener: vi.fn((_event, handler) => {
      listener = handler as Listener;
    }),
    removeEventListener: vi.fn(),
  };

  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQueryList as MediaQueryList));

  return {
    setMatches: (value: boolean) => {
      matches = value;
      listener?.({} as MediaQueryListEvent);
    },
  };
}

describe('useIsMobile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when the viewport is above the breakpoint', () => {
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('returns true when the viewport is below the breakpoint', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('updates when the media query change listener fires', () => {
    const { setMatches } = mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => setMatches(true));

    expect(result.current).toBe(true);
  });
});
