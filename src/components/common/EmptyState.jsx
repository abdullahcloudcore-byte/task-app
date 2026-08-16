import React from "react";
import { CheckSquare, Plus, RefreshCw } from "lucide-react";
import Button from "./Button";

export const EmptyState = ({
  title = "No tasks found",
  description = "No tasks match your current filter criteria or none have been created yet.",
  actionLabel = "Create Task",
  onAction,
  onResetFilters
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-xs">
        <CheckSquare className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <Button
            id="empty-create-task-btn"
            variant="primary"
            size="sm"
            onClick={onAction}
            leftIcon={Plus}
          >
            {actionLabel}
          </Button>
        )}
        {onResetFilters && (
          <Button
            id="empty-reset-filters-btn"
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
            leftIcon={RefreshCw}
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
