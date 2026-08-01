import type { SncComponentWithChildren } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

export type MasterDetailsTablePanelProps = SncComponentWithChildren<{
  /**
   * Heading rendered in the pane's header, beside the close control.
   */
  title?: ReactNode;
  /**
   * Accessible name of the icon-only close control.
   * @default 'Close detail'
   */
  closeLabel?: string;
  onClose: () => void;
}>;
