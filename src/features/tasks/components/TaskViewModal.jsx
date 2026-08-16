import React from "react";
import { Calendar, Clock, User, CheckCircle2, Circle, Edit2, Trash2 } from "lucide-react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { StatusBadge, PriorityBadge, TagBadge } from "../../../components/common/Badge";
import { formatDate, formatDateTime } from "../../../utils/formatters";

export const TaskViewModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  if (!task) return null;

  const isCompleted = task.status === "completed";

  return (
    <Modal
      id="task-view-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title={`Task Details #${task.id}`}
      subtitle="Retrieved via Laravel Resource: GET /api/tasks/:id"
    >
      <div className="space-y-5">
        {/* Status & Priority Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>

          <Button
            type="button"
            id="view-toggle-status-btn"
            variant={isCompleted ? "secondary" : "success"}
            size="sm"
            onClick={() => onToggleStatus(task.id)}
            leftIcon={isCompleted ? Circle : CheckCircle2}
          >
            {isCompleted ? "Mark as Pending" : "Mark as Completed"}
          </Button>
        </div>

        {/* Task Title */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {task.title}
          </h3>
        </div>

        {/* Description */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Description
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">
              Tags & Categories
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <TagBadge key={tag} label={tag} />
              ))}
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <div>
              <p className="text-2xs text-slate-400 font-medium">Due Date</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {task.due_date ? formatDate(task.due_date) : "None assigned"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-2xs text-slate-400 font-medium">Author</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {task.author || "User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-2xs text-slate-400 font-medium">Created At</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {formatDateTime(task.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-2xs text-slate-400 font-medium">Updated At</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {formatDateTime(task.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            id="view-modal-delete-btn"
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            leftIcon={Trash2}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              id="view-modal-close-btn"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              id="view-modal-edit-btn"
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              leftIcon={Edit2}
            >
              Edit Task
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskViewModal;
