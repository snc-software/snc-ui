import type { TableColumn } from '@/Internal/TableBase';

/**
 * The single column the master list collapses to while a row is open. An unmatched (or omitted)
 * `masterColumnId` falls back to the first column rather than rendering an empty list, so a typo in
 * a column id degrades to something usable.
 *
 * Returns `undefined` only when `columns` is itself empty.
 */
export function resolveMasterColumn<TRow extends object>(
  columns: Array<TableColumn<TRow>>,
  masterColumnId?: string,
): TableColumn<TRow> | undefined {
  return columns.find((column) => column.id === masterColumnId) ?? columns[0];
}
