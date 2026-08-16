import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { selectPagination, selectFilters, setPage, setPerPage } from "../tasksSlice";

export const TaskPagination = () => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);

  const { current_page = 1, last_page = 1, total = 0, from = 0, to = 0 } = pagination;

  // Don't show pagination if there are no items
  if (total === 0) return null;

  // Generate page numbers to show (e.g. 1, 2, 3 ... with bounds)
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, current_page - 2);
    let end = Math.min(last_page, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      id="laravel-pagination-controls"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400"
    >
      {/* Showing entries info */}
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{from}</span> to{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{to}</span> of{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{total}</span> tasks
        </span>

        {/* Per page selector */}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-slate-400">Per page:</span>
          <select
            id="pagination-per-page"
            value={filters.per_page}
            onChange={(e) => dispatch(setPerPage(Number(e.target.value)))}
            className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-1">
        {/* Jump to first page */}
        <button
          type="button"
          id="pagination-first"
          disabled={current_page <= 1}
          onClick={() => dispatch(setPage(1))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          id="pagination-prev"
          disabled={current_page <= 1}
          onClick={() => dispatch(setPage(current_page - 1))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 flex items-center gap-1"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((pageNum) => (
            <button
              key={`page-${pageNum}`}
              type="button"
              id={`pagination-page-${pageNum}`}
              onClick={() => dispatch(setPage(pageNum))}
              className={`min-w-[32px] h-8 px-2 rounded-lg font-semibold transition-colors ${
                pageNum === current_page
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          type="button"
          id="pagination-next"
          disabled={current_page >= last_page}
          onClick={() => dispatch(setPage(current_page + 1))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 flex items-center gap-1"
          title="Next Page"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Jump to last page */}
        <button
          type="button"
          id="pagination-last"
          disabled={current_page >= last_page}
          onClick={() => dispatch(setPage(last_page))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskPagination;
