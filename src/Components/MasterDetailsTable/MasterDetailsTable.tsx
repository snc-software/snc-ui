import { useState } from 'react';

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

import { DefaultCloseLabel } from './MasterDetailsTable.constants';
import { classes } from './MasterDetailsTable.styles';
import { resolveMasterColumn } from './MasterDetailsTable.utils';
import MasterDetailsTablePanel from './MasterDetailsTablePanel';

import type { MasterDetailsTableProps } from './MasterDetailsTable.types';

/**
 * An Apple Mail-style two-pane table. With nothing open it is a full-width table; clicking a row
 * collapses the list to a single column, narrows it to a master pane, and opens the row's contents in
 * an independently scrollable detail pane beside it.
 *
 * A sibling of `Table` rather than a wrapper around it: both are layouts over the same
 * `@/Internal/TableBase` parts and the same `useTableController`, so sorting, filtering, pagination,
 * selection and the header/cell treatment are shared code, not lookalikes. The toolbar and filter
 * chips sit above the pane row, spanning the full width of both panes.
 *
 * Both panes scrolling independently requires a bounded height, which this component takes from its
 * container rather than imposing — give the parent a height (e.g. `h-screen`, or a flex/grid track).
 */
export default function MasterDetailsTable<TRow extends object>({
  columns,
  data = [],
  total,
  filters = [],
  onFetchRequested,
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
  detail,
  masterColumnId,
  detailTitle,
  selectedRow,
  defaultSelectedRow,
  onSelectedRowChanged,
  closeLabel = DefaultCloseLabel,
  className,
  ...rest
}: MasterDetailsTableProps<TRow>) {
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

  const [uncontrolledRow, setUncontrolledRow] = useState(defaultSelectedRow);

  // `undefined` is a meaningful value here ("nothing open"), so controlled-ness can't be inferred from
  // the value alone. Both handlers below update internal state *and* call back, so a controlled
  // consumer and an uncontrolled one converge on the same rendered result.
  const openRow = selectedRow !== undefined ? selectedRow : uncontrolledRow;
  const isSplit = openRow !== undefined;

  const masterColumn = resolveMasterColumn(columns, masterColumnId);
  const visibleColumns = isSplit && masterColumn ? [masterColumn] : columns;

  const handleRowClicked = (row: TRow) => {
    setUncontrolledRow(row);
    onSelectedRowChanged?.(row);
  };

  const handleClose = () => {
    setUncontrolledRow(undefined);
    onSelectedRowChanged?.(undefined);
  };

  // Reference equality, matching how selection is tracked — the open row is always an element of the
  // `data` array the consumer supplied, not a structural copy of one.
  const isRowActive = (row: TRow) => row === openRow;

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

      <div className={classes.paneRow}>
        <div
          className={cn(
            tableClasses.surface,
            classes.masterPane,
            isSplit ? classes.masterPaneSplit : classes.masterPaneFull,
          )}
        >
          <div className={cn(tableClasses.scrollArea, classes.masterScrollArea)}>
            <table className={tableClasses.table}>
              <TableHead<TRow>
                store={store}
                columns={visibleColumns}
                data={data}
                isSelectionEnabled={isSelectionEnabled}
                isRowSelectable={isRowSelectable}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChanged={onSortChanged}
              />
              <TableBody<TRow>
                store={store}
                columns={visibleColumns}
                data={data}
                isLoading={isLoading}
                emptyMessage={emptyMessage}
                isSelectionEnabled={isSelectionEnabled}
                isRowSelectable={isRowSelectable}
                isRowActive={isRowActive}
                onRowClicked={handleRowClicked}
              />
            </table>
          </div>

          {isPaginated && <Pagination<TRow> store={store} total={total} />}
        </div>

        {openRow !== undefined && (
          <div className={classes.detailPane}>
            <MasterDetailsTablePanel
              title={detailTitle?.(openRow)}
              closeLabel={closeLabel}
              onClose={handleClose}
            >
              {detail(openRow)}
            </MasterDetailsTablePanel>
          </div>
        )}
      </div>
    </div>
  );
}
