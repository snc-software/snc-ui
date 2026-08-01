import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

export type AccordionItem = {
  /**
   * Stable identifier used for open-state tracking and generated element ids.
   */
  id: string;
  /**
   * Rendered inside the section's header button.
   */
  header: ReactNode;
  /**
   * Rendered in the section's content panel while open.
   */
  content: ReactNode;
};

export type AccordionProps = SncComponent<{
  /**
   * The sections to render, in order.
   */
  items: AccordionItem[];
  /**
   * Controlled usage: ids of currently-open sections.
   */
  openItems?: string[];
  /**
   * Uncontrolled usage: ids open on first render.
   * @default []
   */
  defaultOpenItems?: string[];
  /**
   * Fires with the full updated array whenever a section is toggled, in both controlled and
   * uncontrolled modes.
   */
  onOpenItemsChanged?: (openItems: string[]) => void;
}>;
