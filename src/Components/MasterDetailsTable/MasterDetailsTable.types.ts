import type { TableBaseProps } from '@/Internal/TableBase';
import type { SncComponent } from '@/Types/SncComponent';
import type { ReactNode } from 'react';

/**
 * Built on the same `TableBaseProps` as `Table`, so every prop describing the data behaves
 * identically in both — they read them through one shared hook and hand them to the same parts.
 *
 * There is deliberately no `onRowClicked`: a row click is what opens the detail pane.
 */
export type MasterDetailsTableProps<TRow extends object> = SncComponent<
  TableBaseProps<TRow> & {
    /**
     * Renders the detail pane's contents for the open row.
     */
    detail: (row: TRow) => ReactNode;
    /**
     * `id` of the single column the master list collapses to while a row is open. Falls back to the
     * first column when omitted or when it matches no column.
     */
    masterColumnId?: string;
    /**
     * Heading rendered in the detail pane's header, beside the close control.
     */
    detailTitle?: (row: TRow) => ReactNode;
    /**
     * Controlled open row. Compared by reference, matching the selection model — pass a row from the
     * same `data` array, not a structural copy.
     */
    selectedRow?: TRow;
    /**
     * Row open on first render when `selectedRow` is not supplied.
     */
    defaultSelectedRow?: TRow;
    /**
     * Called with the clicked row when the detail pane opens, and with `undefined` when it closes.
     */
    onSelectedRowChanged?: (row: TRow | undefined) => void;
    /**
     * Accessible name of the icon-only close control.
     * @default 'Close detail'
     */
    closeLabel?: string;
  }
>;
