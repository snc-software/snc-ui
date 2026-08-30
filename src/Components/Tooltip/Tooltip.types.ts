import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export type TooltipProps = Omit<
  SncComponentWithChildren<
    Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'style' | 'children' | 'content'>
  >,
  'children'
> & {
  /**
   * Content rendered inside the floating tooltip panel.
   */
  content: ReactNode;
  /**
   * The single trigger element that shows the tooltip on hover/focus. Enhanced in place via
   * `cloneElement`, so it must be a single element (not text) that accepts a `ref` and forwards
   * standard DOM event handlers.
   */
  children: ReactElement;
  /**
   * Which side of the trigger the tooltip renders on.
   * @default 'bottom'
   */
  placement?: TooltipPlacement;
  /**
   * Suppresses showing the tooltip entirely.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * How long the trigger must be continuously hovered/focused before the tooltip appears.
   * @default 1000
   */
  showDelayMs?: number;
};
