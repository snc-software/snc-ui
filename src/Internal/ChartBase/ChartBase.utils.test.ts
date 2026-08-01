import { describe, expect, it } from 'vitest';

import { resolveSeriesColor } from './ChartBase.utils';

const palette = ['#111111', '#222222', '#333333'];

describe('resolveSeriesColor', () => {
  it('returns the series-supplied color override when one is provided', () => {
    expect(resolveSeriesColor(0, '#custom', palette)).toBe('#custom');
  });

  it('falls back to the palette entry at the series index when no override is provided', () => {
    expect(resolveSeriesColor(1, undefined, palette)).toBe('#222222');
  });

  it('wraps around the palette when there are more series than palette entries', () => {
    expect(resolveSeriesColor(4, undefined, palette)).toBe('#222222');
  });
});
