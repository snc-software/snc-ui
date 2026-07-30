import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { RefObject } from 'react';

export type TableFilterPopoverProps = SncComponentWithChildren<{
  /**
   * Whether the panel is rendered. Ownership of the open state stays with `TableHeadCell`.
   */
  isOpen: boolean;
  /**
   * Element the panel is anchored beneath, and which regains focus on dismissal.
   */
  triggerRef: RefObject<HTMLElement | null>;
  /**
   * Called on Escape, on an outside press, and on an outside focus move.
   */
  onClose: () => void;
  /**
   * Horizontal edge the panel aligns to.
   * @default 'left'
   */
  alignMenu?: 'left' | 'right';
  /**
   * Matches the panel's width to the trigger's.
   * @default true
   */
  hasAdaptiveWidth?: boolean;
}>;
