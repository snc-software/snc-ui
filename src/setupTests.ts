import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

/**
 * jsdom implements neither ResizeObserver nor real layout, so Recharts' `ResponsiveContainer`
 * (used by every chart component) measures a 0×0 parent and renders no chart children. Polyfilling
 * both here, rather than per chart test file, keeps every consumer of ResponsiveContainer testable.
 */
class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub;

const emptyRect: DOMRect = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  x: 0,
  y: 0,
  toJSON: () => {},
};

/**
 * Only the `ResponsiveContainer` wrapper itself needs a non-zero size — Recharts also calls
 * `getBoundingClientRect()` on plenty of other elements it measures (e.g. the legend, via
 * `useElementOffset`), and giving every element the same fixed size makes Recharts think a legend
 * div is as tall as the whole chart, leaving zero height for the plot area itself.
 */
Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element) {
  if (!this.classList.contains('recharts-responsive-container')) {
    return emptyRect;
  }

  return {
    ...emptyRect,
    width: 800,
    height: 400,
    right: 800,
    bottom: 400,
  };
};
