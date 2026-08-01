import { NavArrowDown, Search, Sort, SortDown, SortUp } from 'iconoir-react';
import { useRef, useState } from 'react';
import { useStore } from 'zustand';

import Popout from '@/Internal/Popout';
import { cn } from '@/Utils/cn';

import { classes as tableClasses } from '../../TableBase.styles';
import { getNextSortDirection } from '../../TableBase.utils';
import TableDropdownFilterMenu from './Menus/TableDropdownFilterMenu';
import TableInputFilterMenu from './Menus/TableInputFilterMenu';
import { FilterIconOpenClass, IconSize } from './TableHeadCell.constants';
import { classes } from './TableHeadCell.styles';

import type { TableHeadCellProps } from './TableHeadCell.types';
import type { ReactNode } from 'react';

const AriaSort = {
  asc: 'ascending',
  desc: 'descending',
} as const;

/**
 * A single column header: title, optional sort control, and optional filter popover.
 *
 * Only meaningful as a child of `TableHeadRow`. the
 * per-filter-type variants there only chose an icon and a menu before delegating, which is what
 * {@link FilterIcons} and `renderMenu` do here.
 */
export default function TableHeadCell<TRow extends object>({
  store,
  column,
  sortDirection,
  onSortChanged,
  className,
  style,
  ...rest
}: TableHeadCellProps<TRow>) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const filters = useStore(store, (state) => state.activeFilters);
  const onFiltersSet = useStore(store, (state) => state.applyFilters);
  const onFiltersCleared = useStore(store, (state) => state.clearFilters);

  const isFilterable = column.filterType !== undefined;
  const headerContent = column.header ? column.header(column.title) : column.title;

  const handleSortClicked = () => {
    onSortChanged?.(column.id, getNextSortDirection(sortDirection));
  };

  const closeMenu = () => setIsOpen(false);

  // Icons are selected by rendering the element directly rather than picking a component out of a map
  // and instantiating it — the latter reads as "component created during render" and would remount the
  // icon on every keystroke.
  const renderFilterIcon = (): ReactNode => {
    if (column.filterType === 'custom') {
      return column.filterIcon(isOpen);
    }

    if (column.filterType === 'input') {
      return <Search className={classes.filterIcon} width={IconSize} height={IconSize} />;
    }

    if (column.filterType === 'dropdown') {
      return (
        <NavArrowDown
          className={cn(classes.filterIcon, isOpen && FilterIconOpenClass)}
          width={IconSize}
          height={IconSize}
        />
      );
    }

    return null;
  };

  const renderSortIcon = (): ReactNode => {
    if (sortDirection === 'asc') {
      return <SortUp width={IconSize} height={IconSize} />;
    }

    if (sortDirection === 'desc') {
      return <SortDown width={IconSize} height={IconSize} />;
    }

    return <Sort width={IconSize} height={IconSize} />;
  };

  const renderMenu = (): ReactNode => {
    const menuProps = {
      filters,
      onClose: closeMenu,
      onFiltersSet,
      onFiltersCleared,
    };

    if (column.filterType === 'custom') {
      return column.menu(menuProps);
    }

    if (column.filterType === 'input') {
      return (
        <TableInputFilterMenu
          columnId={column.id}
          title={column.title}
          placeholder={column.placeholder}
          isClearable={column.isClearable}
          {...menuProps}
        />
      );
    }

    if (column.filterType === 'dropdown') {
      return (
        <TableDropdownFilterMenu
          columnId={column.id}
          title={column.title}
          options={column.options}
          isClearable={column.isClearable}
          {...menuProps}
        />
      );
    }

    return null;
  };

  return (
    <th
      scope="col"
      aria-sort={onSortChanged ? (sortDirection ? AriaSort[sortDirection] : 'none') : undefined}
      className={cn(tableClasses.cell, tableClasses.cellOverlap, classes.cell, className)}
      style={{ width: column.width, ...style }}
      data-testid={`head-cell-${column.id}`}
      {...rest}
    >
      <div className={classes.content}>
        {isFilterable ? (
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-label={`Filter by ${column.title.toLowerCase()}`}
            className={cn(classes.control, classes.filterTrigger)}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className={classes.titleText}>{headerContent}</span>
            {renderFilterIcon()}
          </button>
        ) : (
          <div className={classes.title}>
            <span className={classes.titleText}>{headerContent}</span>
          </div>
        )}

        {onSortChanged && (
          <button
            type="button"
            aria-label={`Sort by ${column.title.toLowerCase()}`}
            className={classes.control}
            onClick={handleSortClicked}
          >
            {renderSortIcon()}
          </button>
        )}
      </div>

      {isFilterable && (
        <Popout
          isOpen={isOpen}
          anchorRef={triggerRef}
          onClose={closeMenu}
          align={column.alignMenu}
          hasAdaptiveWidth={column.hasAdaptiveWidth}
          data-testid="table-filter-popover"
        >
          {renderMenu()}
        </Popout>
      )}
    </th>
  );
}
