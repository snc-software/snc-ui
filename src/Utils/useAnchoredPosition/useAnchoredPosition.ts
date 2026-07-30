import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import type { CSSProperties, RefObject } from 'react';

type AnchoredPositionOptions = {
  /**
   * Whether the anchored element is currently rendered. Positioning and the scroll/resize listeners
   * are skipped entirely while closed.
   */
  isOpen: boolean;
  /**
   * Element the panel is positioned against.
   */
  triggerRef: RefObject<HTMLElement | null>;
  /**
   * Which edge of the panel lines up with the matching edge of the trigger.
   * @default 'left'
   */
  align?: 'left' | 'right';
  /**
   * Matches the panel's width to the trigger's width.
   * @default true
   */
  hasAdaptiveWidth?: boolean;
};

/**
 * Positions a fixed-position panel against a trigger element, keeping it aligned as the page scrolls
 * or resizes.
 *
 * Exists so panels can be portalled out to `document.body` instead of living next to their trigger: a
 * container with `overflow-x` other than `visible` computes `overflow-y: auto`, which clips an in-flow
 * panel at the container's bottom edge. Anything anchored inside the table's horizontally scrolling
 * area — a column's filter menu, a `Select` in the toolbar — hits that, so both take their coordinates
 * from the trigger's viewport rect instead.
 *
 * Returns the style object to spread onto the panel; `undefined` until the first measurement lands.
 */
export function useAnchoredPosition({
  isOpen,
  triggerRef,
  align = 'left',
  hasAdaptiveWidth = true,
}: AnchoredPositionOptions): CSSProperties | undefined {
  const [position, setPosition] = useState<CSSProperties>();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    setPosition({
      top: rect.bottom,
      ...(align === 'right'
        ? { right: Math.max(0, window.innerWidth - rect.right) }
        : { left: rect.left }),
      ...(hasAdaptiveWidth ? { width: rect.width } : {}),
    });
  }, [align, hasAdaptiveWidth, triggerRef]);

  // Layout effect so the panel is positioned before paint — otherwise it flashes at the origin.
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // `true` so ancestor scroll containers (the table's own scroll area) are caught, not just window.
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  return position;
}
