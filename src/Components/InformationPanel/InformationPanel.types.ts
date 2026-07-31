import type { Variants } from './InformationPanel.constants';
import type { SncComponent } from '@/Types/SncComponent';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export type InformationPanelProps = SncComponent<
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'style' | 'children'> & {
    /**
     * Semantic status the panel communicates. No default: every usage must state which status it
     * represents.
     */
    variant: keyof typeof Variants;
    /**
     * Heading text, rendered in the heading font. Omitted entirely when not provided.
     */
    heading?: ReactNode;
    /**
     * Supporting body text, rendered in the body font. Omitted entirely when not provided.
     */
    subtext?: ReactNode;
    /**
     * Visibility. Supplying this makes the panel controlled — it then only opens/closes when the
     * consumer passes a new value, e.g. a toast manager dismissing it externally on a timeout.
     */
    open?: boolean;
    /**
     * Initial visibility when the panel is left uncontrolled (`open` omitted). The panel then owns
     * its own dismissal from this point on.
     * @default true
     */
    defaultOpen?: boolean;
    /**
     * Called when the dismiss button is clicked, in both controlled and uncontrolled modes. When
     * omitted, no dismiss button is rendered. In uncontrolled mode the panel has already removed
     * itself by the time this fires; in controlled mode the consumer is expected to respond by
     * setting `open` to `false`.
     */
    onDismiss?: () => void;
    /**
     * Accessible name for the dismiss button. Only relevant when `onDismiss` is provided.
     * Defaults to `Dismiss`.
     */
    dismissLabel?: string;
    ref?: Ref<HTMLDivElement>;
  }
>;
