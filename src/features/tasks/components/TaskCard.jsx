import React from "react";
import { Eye, Edit2, Trash2, CheckCircle, Circle, Calendar, User } from "lucide-react";
import { StatusBadge, PriorityBadge, TagBadge } from "../../../components/common/Badge";
import { formatDate } from "../../../utils/formatters";

export const TaskCard = ({
  task,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const isCompleted = task.status === "completed";

  return (
    <div
      id={`task-card-${task.id}`}
      className={`group relative flex flex-col justify-between p-5 rounded-xl border bg-white dark:bg-slate-900 transition-all duration-150 shadow-2xs hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 ${
        isCompleted
          ? "border-slate-200/60 dark:border-slate-800/80 opacity-85"
          : "border-slate-200/90 dark:border-slate-800"
      }`}
    >
      <div>
        {/* Badges & Quick Toggle */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
          <button
            type="button"
            id={`toggle-task-${task.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(task.id);
            }}
            title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5 rounded focus:outline-none"
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 hover:text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
            )}
          </button>
        </div>

        {/* Task Title */}
        <h4
          onClick={() => onView(task)}
          className={`text-base font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 ${
            isCompleted ? "line-through text-slate-500 dark:text-slate-400" : ""
          }`}
        >
          {task.title}
        </h4>

        {/* Description snippet */}
        {task.description && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            {task.tags.map((tag, idx) => (
              <TagBadge key={`${tag}-${idx}`} label={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          {task.due_date && (
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              {formatDate(task.due_date)}
            </span>
          )}
          {task.author && (
            <span className="hidden sm:flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {task.author}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            id={`btn-view-${task.id}`}
            onClick={() => onView(task)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            id={`btn-edit-${task.id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id={`btn-delete-${task.id}`}
            onClick={() => onDelete(task)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
