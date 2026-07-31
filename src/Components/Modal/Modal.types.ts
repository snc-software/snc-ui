import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { HTMLAttributes, Ref } from 'react';

export type ModalProps = SncComponentWithChildren<
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Whether the modal is shown. Nothing is rendered, focus-trapped or listened for while closed.
     */
    isOpen: boolean;
    /**
     * Called on Escape, on a backdrop click (when enabled), and on the built-in close button click.
     * The consumer is expected to flip `isOpen` to `false` in response — the modal never closes itself.
     */
    onClose: () => void;
    /**
     * Whether clicking the dimmed/blurred backdrop (outside the card) calls `onClose`.
     * @default true
     */
    shouldCloseOnOverlayClick?: boolean;
    /**
     * Accessible name (`aria-label`) for the always-present close button.
     * @default 'Close'
     */
    closeLabel?: string;
    ref?: Ref<HTMLDivElement>;
  }
>;
