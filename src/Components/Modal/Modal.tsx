import { Xmark } from 'iconoir-react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/Utils/cn';

import { classes } from './Modal.styles';
import { getFocusableElements } from './Modal.utils';

import type { ModalProps } from './Modal.types';

/**
 * A portalled, centred dialog card over a blurred/dimmed backdrop. Fully controlled — the consumer
 * renders and wires up their own trigger element elsewhere, and flips `isOpen` in response to
 * `onClose`, matching `Internal/Popout`'s `isOpen`/`onClose` convention.
 *
 * Portalled to `document.body` for the same reason `Popout` is: a container with `overflow` other
 * than `visible` would otherwise clip an in-flow panel at the first scrolling ancestor.
 */
export default function Modal({
  ref,
  isOpen,
  onClose,
  shouldCloseOnOverlayClick = true,
  closeLabel = 'Close',
  className,
  style,
  children,
  ...rest
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  // Layout effect so focus moves before the browser paints the newly-opened dialog.
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const panel = panelRef.current;
      const focusable = panel ? getFocusableElements(panel) : [];

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    // Backdrop is a pointer-only convenience — Escape (handled above) is its keyboard equivalent, and
    // giving it a focusable/interactive role would pull focus outside the trap. `currentTarget` check
    // (rather than stopPropagation on the panel) means only a genuine backdrop click closes it.
    // eslint-disable-next-line jsx-a11y-x/click-events-have-key-events, jsx-a11y-x/no-static-element-interactions
    <div
      className={classes.overlay}
      onClick={(event) => {
        if (shouldCloseOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={setPanelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(classes.panel, className)}
        style={style}
        {...rest}
      >
        <button
          type="button"
          aria-label={closeLabel}
          className={classes.closeButton}
          onClick={onClose}
        >
          <Xmark width={16} height={16} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
