import { describe, expect, it } from 'vitest';

import { getTooltipPosition } from './Tooltip.utils';

describe('getTooltipPosition', () => {
  const triggerRect = { top: 100, bottom: 130, left: 50, right: 150, width: 100, height: 30 };
  const tooltipRect = { width: 60, height: 20 };
  const gap = 8;

  it('positions the tooltip above and horizontally centred on the trigger for placement "top"', () => {
    expect(getTooltipPosition(triggerRect, tooltipRect, 'top', gap)).toEqual({
      top: 72,
      left: 70,
    });
  });

  it('positions the tooltip below and horizontally centred on the trigger for placement "bottom"', () => {
    expect(getTooltipPosition(triggerRect, tooltipRect, 'bottom', gap)).toEqual({
      top: 138,
      left: 70,
    });
  });

  it('positions the tooltip to the left and vertically centred on the trigger for placement "left"', () => {
    expect(getTooltipPosition(triggerRect, tooltipRect, 'left', gap)).toEqual({
      top: 105,
      left: -18,
    });
  });

  it('positions the tooltip to the right and vertically centred on the trigger for placement "right"', () => {
    expect(getTooltipPosition(triggerRect, tooltipRect, 'right', gap)).toEqual({
      top: 105,
      left: 158,
    });
  });
});
