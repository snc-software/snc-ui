import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/Utils/cn';
import { useAnchoredPosition } from '@/Utils/useAnchoredPosition';

import { classes } from './Popout.styles';
import { isTopmostLayer, isWithinLayerAbove, registerLayer } from './Popout.utils';

import type { PopoutProps } from './Popout.types';

/**
 * A dismissible panel anchored to a trigger and portalled to `document.body`.
 *
 * Internal to the library — shared plumbing behind `Select` and the table's column filter menus, not
 * something a consumer composes with.
 *
 * Portalled because a container with `overflow-x` other than `visible` computes `overflow-y: auto`,
 * which clips an in-flow panel at the first scrolling ancestor.
 */
export default function Popout({
  isOpen,
  anchorRef,
  positionRef,
  onClose,
  align = 'left',
  hasAdaptiveWidth = true,
  shouldReturnFocusOnClose = true,
  className,
  style,
  children,
  ...rest
}: PopoutProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const position = useAnchoredPosition({
    isOpen,
    triggerRef: positionRef ?? anchorRef,
    align,
    hasAdaptiveWidth,
  });

  // Layout effect, not a plain one: React runs child effects before parent ones, so this guarantees
  // registration beats a parent's focus effect. Otherwise that first `focusin` escapes an empty stack
  // and dismisses the popout underneath.
  useLayoutEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    return registerLayer(panel);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideInteraction = (event: Event) => {
      const panel = panelRef.current;
      const { target } = event;

      if (!panel || !(target instanceof Node)) {
        return;
      }

      const isInside =
        panel.contains(target) ||
        anchorRef.current?.contains(target) ||
        isWithinLayerAbove(panel, target);

      if (!isInside) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const panel = panelRef.current;

      // Topmost only, so nesting unwinds one level per keypress.
      if (event.key !== 'Escape' || !panel || !isTopmostLayer(panel)) {
        return;
      }

      event.stopPropagation();
      onClose();

      if (shouldReturnFocusOnClose) {
        anchorRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handleOutsideInteraction);
    document.addEventListener('focusin', handleOutsideInteraction);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideInteraction);
      document.removeEventListener('focusin', handleOutsideInteraction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef, shouldReturnFocusOnClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    // Consumer style merges over the position rather than replacing it.
    <div
      ref={panelRef}
      className={cn(classes.panel, className)}
      style={{ ...position, ...style }}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
}
