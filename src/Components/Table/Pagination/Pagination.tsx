import { FastArrowLeft, FastArrowRight, NavArrowLeft, NavArrowRight } from 'iconoir-react';
import { useStore } from 'zustand';

import { cn } from '@/Utils/cn';

import { getPageCount, getPageNumbers } from '../Table.utils';
import { classes } from './Pagination.styles';

import type { PaginationProps } from './Pagination.types';

/**
 * Page controls for the table: first/previous jumps, a window of page numbers, then next/last.
 *
 * Named without the `Table` prefix by explicit developer decision (see `plans/issue-9-table.md`,
 * Scope Decision 11) — it remains a `Table` sub-component and is only meaningful inside one.
 */
export default function Pagination<TRow extends object>({
  store,
  total,
  size = 2,
  className,
  ...rest
}: PaginationProps<TRow>) {
  const page = useStore(store, (state) => state.page);
  const pageSize = useStore(store, (state) => state.pageSize);
  const setPage = useStore(store, (state) => state.setPage);

  const pageCount = getPageCount(total, pageSize);
  const pageNumbers = getPageNumbers(page, pageCount, size);

  if (pageCount <= 0) {
    return null;
  }

  const selectPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) {
      return;
    }

    setPage(nextPage);
  };

  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  return (
    <nav aria-label="Pagination" className={cn(classes.base, className)} {...rest}>
      <div className={classes.jumpGroup}>
        {!isFirstPage && (
          <>
            <button
              type="button"
              aria-label="Go to first page"
              className={classes.control}
              onClick={() => selectPage(1)}
            >
              <FastArrowLeft width={18} height={18} />
            </button>
            <button
              type="button"
              aria-label="Go to previous page"
              className={classes.control}
              onClick={() => selectPage(page - 1)}
            >
              <NavArrowLeft width={18} height={18} />
            </button>
          </>
        )}
      </div>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-label={`Go to page ${pageNumber}`}
          aria-current={pageNumber === page ? 'page' : undefined}
          className={cn(classes.control, pageNumber === page && classes.pageCurrent)}
          onClick={() => selectPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <div className={classes.jumpGroup}>
        {!isLastPage && (
          <>
            <button
              type="button"
              aria-label="Go to next page"
              className={classes.control}
              onClick={() => selectPage(page + 1)}
            >
              <NavArrowRight width={18} height={18} />
            </button>
            <button
              type="button"
              aria-label="Go to last page"
              className={classes.control}
              onClick={() => selectPage(pageCount)}
            >
              <FastArrowRight width={18} height={18} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
