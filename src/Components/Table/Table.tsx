import {
  DefaultPageSizeOptions,
  Pagination,
  TableBody,
  TableFilterPanel,
  TableHead,
  TableToolbar,
  classes as tableClasses,
} from '@/Internal/TableBase';
import { useTableController } from '@/States/useTableController';
import { cn } from '@/Utils/cn';

import { classes } from './Table.styles';

import type { TableProps } from './Table.types';

export default function Table<TRow extends object>({
  columns,
  data = [],
  total,
  filters = [],
  onFetchRequested,
  onRowClicked,
  isLoading = false,
  isRowSelectable,
  getSelectionActions,
  onSelectionActionClicked,
  actions = [],
  onActionClicked,
  hideActionsWhenRowsSelected = false,
  isPaginated = true,
  pageSize: initialPageSize,
  pageSizeOptions = DefaultPageSizeOptions,
  emptyMessage,
  className,
  ...rest
}: TableProps<TRow>) {
  const {
    store,
    activeFilters,
    sortBy,
    sortDirection,
    selectionActions,
    isSelectionEnabled,
    isToolbarVisible,
    onSortChanged,
    onSelectionActionClicked: handleSelectionActionClicked,
  } = useTableController<TRow>({
    filters,
    onFetchRequested,
    initialPageSize,
    pageSizeOptions,
    getSelectionActions,
    onSelectionActionClicked,
    actions,
    isPaginated,
  });

  return (
    <div className={cn(classes.root, className)} {...rest}>
      {isToolbarVisible && (
        <TableToolbar<TRow>
          store={store}
          dataLength={data.length}
          total={total}
          pageSizeOptions={pageSizeOptions}
          isPaginated={isPaginated}
          actions={actions}
          onActionClicked={onActionClicked}
          hideActionsWhenRowsSelected={hideActionsWhenRowsSelected}
          selectionActions={selectionActions}
          onSelectionActionClicked={handleSelectionActionClicked}
        />
      )}

      {activeFilters.length > 0 && <TableFilterPanel<TRow> store={store} />}

      <div className={tableClasses.surface}>
        <div className={tableClasses.scrollArea}>
          <table className={tableClasses.table}>
            <TableHead<TRow>
              store={store}
              columns={columns}
              data={data}
              isSelectionEnabled={isSelectionEnabled}
              isRowSelectable={isRowSelectable}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChanged={onSortChanged}
            />
            <TableBody<TRow>
              store={store}
              columns={columns}
              data={data}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              isSelectionEnabled={isSelectionEnabled}
              isRowSelectable={isRowSelectable}
              onRowClicked={onRowClicked}
            />
          </table>
        </div>

        {isPaginated && <Pagination<TRow> store={store} total={total} />}
      </div>
    </div>
  );
}
