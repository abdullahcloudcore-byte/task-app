import React from "react";
import { getStatusBadgeConfig, getPriorityBadgeConfig } from "../../utils/formatters";

export const StatusBadge = ({ status, className = "" }) => {
  const config = getStatusBadgeConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority, className = "" }) => {
  const config = getPriorityBadgeConfig(priority);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className={`font-bold ${config.iconColor}`}>•</span>
      {config.label}
    </span>
  );
};

export const TagBadge = ({ label, onRemove, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}
    >
      #{label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(label);
          }}
          className="ml-0.5 text-slate-400 hover:text-rose-500 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
};
