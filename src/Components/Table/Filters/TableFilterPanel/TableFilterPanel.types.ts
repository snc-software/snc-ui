import type { TableStore } from '@/States/useTableState';
import type { SncComponent } from '@/Types/SncComponent';

export type TableFilterPanelProps<TRow extends object> = SncComponent<{
  store: TableStore<TRow>;
}>;
