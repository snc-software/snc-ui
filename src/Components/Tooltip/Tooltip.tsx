import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/Utils/cn';

import { classes } from './Tooltip.styles';
import { getTooltipPosition, TooltipGap } from './Tooltip.utils';

import type { TooltipProps } from './Tooltip.types';
import type { CSSProperties, ReactElement } from 'react';

type TriggerProps = {
  'aria-describedby'?: string;
};

/**
 * Shows `content` in a small floating panel after the single trigger element has been
 * continuously hovered or focused for `showDelayMs`, following the WAI-ARIA APG Tooltip pattern
 * (hide on mouse-leave/blur/Escape/pointerdown of the trigger).
 *
 * Portalled to `document.body`, like `Internal/Popout`/`Modal`, so it isn't clipped by an
 * ancestor with `overflow` other than `visible` (e.g. `Card`'s bordered, overflow-hidden root).
 * Not built on `Internal/Popout` — that primitive is for click-triggered, edge-aligned dropdown
 * panels with a dismiss/focus-stack model that doesn't fit a hover tooltip's directional,
 * centred placement, so positioning is calculated separately in `Tooltip.utils.ts`.
 *
 * The trigger is wrapped in an inline-flex `<span>` rather than enhanced via `cloneElement`'s
 * `ref` — this repo's lint config (`react-hooks/refs`) treats threading a ref through
 * `cloneElement` as unsafe during render. `cloneElement` is still used, but only to add the
 * static `aria-describedby` prop, which carries no ref/render-safety risk.
 */
export default function Tooltip({
  content,
  children,
  placement = 'bottom',
  isDisabled = false,
  showDelayMs = 1000,
  id,
  className,
  style,
  ...rest
}: TooltipProps) {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>();

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const child = children as ReactElement<TriggerProps>;

  const show = () => {
    if (isDisabled) {
      return;
    }

    clearTimeout(showTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => setIsOpen(true), showDelayMs);
  };

  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(showTimeoutRef.current);
  }, []);

  // Layout effect so the panel is positioned before paint — otherwise it flashes at the origin.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;

    if (!isOpen || !trigger || !panel) {
      return;
    }

    const updatePosition = () => {
      setPosition(
        getTooltipPosition(
          trigger.getBoundingClientRect(),
          panel.getBoundingClientRect(),
          placement,
          TooltipGap,
        ),
      );
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, placement]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hide]);

  const trigger = cloneElement(child, {
    'aria-describedby': isOpen ? tooltipId : child.props['aria-describedby'],
  });

  return (
    <>
      <span
        ref={triggerRef}
        className={classes.wrapper}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onPointerDown={hide}
      >
        {trigger}
      </span>
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            id={tooltipId}
            role="tooltip"
            className={cn(classes.panel, className)}
            style={{ ...position, ...style }}
            {...rest}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
