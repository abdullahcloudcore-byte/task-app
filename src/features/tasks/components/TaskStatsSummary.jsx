import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from "lucide-react";
import {
  selectTasks,
  selectPagination,
  selectFilters,
  setStatusFilter,
  setPriorityFilter,
  resetFilters
} from "../tasksSlice";

export const TaskStatsSummary = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);

  // Compute counts from all available or current loaded items
  const totalTasks = pagination.total || tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const highPriorityCount = tasks.filter((t) => t.priority === "high").length;

  const stats = [
    {
      id: "stat-all",
      label: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      active: filters.status === "all" && filters.priority === "all",
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      onClick: () => dispatch(resetFilters())
    },
    {
      id: "stat-inprogress",
      label: "In Progress",
      value: inProgressCount,
      icon: Clock,
      active: filters.status === "in_progress",
      color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-800",
      onClick: () => dispatch(setStatusFilter(filters.status === "in_progress" ? "all" : "in_progress"))
    },
    {
      id: "stat-completed",
      label: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      active: filters.status === "completed",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      onClick: () => dispatch(setStatusFilter(filters.status === "completed" ? "all" : "completed"))
    },
    {
      id: "stat-high-priority",
      label: "High Priority",
      value: highPriorityCount,
      icon: AlertTriangle,
      active: filters.priority === "high",
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800",
      onClick: () => dispatch(setPriorityFilter(filters.priority === "high" ? "all" : "high"))
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <button
            key={stat.id}
            id={stat.id}
            type="button"
            onClick={stat.onClick}
            className={`p-4 rounded-xl border text-left transition-all duration-150 relative overflow-hidden group cursor-pointer ${
              stat.active
                ? "ring-2 ring-indigo-500 ring-offset-1 bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-700 shadow-sm"
                : "bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg border ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {stat.value}
              </span>
              {stat.active && (
                <span className="text-2xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Active Filter
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TaskStatsSummary;
