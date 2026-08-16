import React from "react";
import { Eye, Edit2, Trash2, CheckCircle, Circle, Calendar } from "lucide-react";
import { StatusBadge, PriorityBadge, TagBadge } from "../../../components/common/Badge";
import { formatDate } from "../../../utils/formatters";

export const TaskTable = ({
  tasks,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-2xs">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4">Task Details</th>
              <th className="py-3 px-4 w-32">Priority</th>
              <th className="py-3 px-4 w-32">Due Date</th>
              <th className="py-3 px-4 w-28">Created By</th>
              <th className="py-3 px-4 w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {tasks.map((task) => {
              const isCompleted = task.status === "completed";
              return (
                <tr
                  key={task.id}
                  id={`task-row-${task.id}`}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Quick Toggle Column */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      id={`table-toggle-${task.id}`}
                      onClick={() => onToggleStatus(task.id)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                      title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  </td>

                  {/* Title & Tags */}
                  <td className="py-3 px-4">
                    <div>
                      <span
                        onClick={() => onView(task)}
                        className={`font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                          isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.tags && task.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {task.tags.map((tag, idx) => (
                            <TagBadge key={`${tag}-${idx}`} label={tag} className="text-3xs px-1.5 py-0" />
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {task.due_date ? (
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(task.due_date)}
                      </span>
                    ) : (
                      <span className="text-slate-400">No date</span>
                    )}
                  </td>

                  {/* Author */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                    {task.author || "User"}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        id={`table-btn-view-${task.id}`}
                        onClick={() => onView(task)}
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded transition-colors"
                        title="View Task"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        id={`table-btn-edit-${task.id}`}
                        onClick={() => onEdit(task)}
                        className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        id={`table-btn-delete-${task.id}`}
                        onClick={() => onDelete(task)}
                        className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
