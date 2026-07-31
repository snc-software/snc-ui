import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { HTMLAttributes, RefObject } from 'react';

export type PopoutProps = SncComponentWithChildren<
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Whether the panel is shown. Nothing is rendered, positioned or listened for while closed.
     */
    isOpen: boolean;
    /**
     * Element the panel is positioned against, and which regains focus when Escape dismisses it.
     * Interactions on it are never treated as "outside", so a trigger can toggle the panel without
     * racing the dismissal logic.
     */
    anchorRef: RefObject<HTMLElement | null>;
    /**
     * Called on an outside interaction, or on Escape while this is the topmost popout.
     */
    onClose: () => void;
    /**
     * Which edge of the panel lines up with the matching edge of the anchor.
     * @default 'left'
     */
    align?: 'left' | 'right';
    /**
     * Matches the panel's width to the anchor's width.
     * @default true
     */
    hasAdaptiveWidth?: boolean;
    /**
     * Returns focus to the anchor when Escape dismisses the panel. Turn off where the consumer moves
     * focus somewhere more useful itself.
     * @default true
     */
    shouldReturnFocusOnClose?: boolean;
  }
>;
