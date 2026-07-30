import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/Utils/cn';
import { useAnchoredPosition } from '@/Utils/useAnchoredPosition';
import { useClickOutside } from '@/Utils/useClickOutside';

import { classes } from './TableFilterPopover.styles';

import type { TableFilterPopoverProps } from './TableFilterPopover.types';

/**
 * Anchored dismissible panel for a column's filter menu.
 *
 * Only meaningful as a child of `TableHeadCell` — it takes its anchor from the head cell's filter
 * trigger and hands dismissal back to it.
 *
 * Rendered through a portal on purpose: the table sits inside a horizontally scrolling container, and
 * a container with `overflow-x` other than `visible` computes `overflow-y: auto`, which would clip an
 * in-flow panel at the table's bottom edge. Portalling to `document.body` and positioning from the
 * trigger's viewport rect sidesteps that entirely.
 */
export default function TableFilterPopover({
  isOpen,
  triggerRef,
  onClose,
  alignMenu = 'left',
  hasAdaptiveWidth = true,
  className,
  children,
  ...rest
}: TableFilterPopoverProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const position = useAnchoredPosition({
    isOpen,
    triggerRef,
    align: alignMenu,
    hasAdaptiveWidth,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  useClickOutside([panelRef, triggerRef], onClose, isOpen);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={panelRef}
      className={cn(classes.panel, className)}
      style={position}
      data-testid="table-filter-popover"
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
}
