import type { TooltipPlacement } from './Tooltip.types';

/** Gap, in pixels, between the trigger and the tooltip panel. */
export const TooltipGap = 8;

type TriggerRect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right' | 'width' | 'height'>;
type TooltipRect = Pick<DOMRect, 'width' | 'height'>;

/**
 * Computes the `top`/`left` viewport coordinates for a `position: fixed` tooltip panel, centred
 * on the trigger along the axis perpendicular to `placement`.
 */
export function getTooltipPosition(
  triggerRect: TriggerRect,
  tooltipRect: TooltipRect,
  placement: TooltipPlacement,
  gap: number,
): { top: number; left: number } {
  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top - tooltipRect.height - gap,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case 'right':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + gap,
      };
    case 'left':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - gap,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + gap,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
  }
}
