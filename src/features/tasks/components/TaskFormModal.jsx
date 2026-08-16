import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Save, Tag, AlertCircle } from "lucide-react";
import Modal from "../../../components/common/Modal";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";
import { TagBadge } from "../../../components/common/Badge";
import {
  createTask,
  updateTask,
  clearTaskErrors,
  selectTasksMutating,
  selectTaskErrors
} from "../tasksSlice";

export const TaskFormModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const isMutating = useSelector(selectTasksMutating);
  const { error, validationErrors } = useSelector(selectTaskErrors);

  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
    tags: []
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "pending",
        priority: initialData.priority || "medium",
        due_date: initialData.due_date ? initialData.due_date.split("T")[0] : "",
        tags: Array.isArray(initialData.tags) ? [...initialData.tags] : []
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        tags: ["Laravel", "Feature"]
      });
    }
    setTagInput("");
    dispatch(clearTaskErrors());
  }, [initialData, isOpen, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      dispatch(clearTaskErrors());
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, "");
    if (clean && !formData.tags.includes(clean)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, clean]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const result = await dispatch(updateTask({ id: initialData.id, data: formData }));
      if (updateTask.fulfilled.match(result)) {
        onClose();
      }
    } else {
      const result = await dispatch(createTask(formData));
      if (createTask.fulfilled.match(result)) {
        onClose();
      }
    }
  };

  return (
    <Modal
      id="task-form-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title={isEditing ? `Edit Task #${initialData.id}` : "Create New Task"}
      subtitle={
        isEditing
          ? "Sends PUT /api/tasks/:id payload to Laravel"
          : "Sends POST /api/tasks payload with Eloquent validation"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Title input */}
        <FormInput
          id="task-title-input"
          name="title"
          label="Task Title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Implement API Resource transformers"
          error={validationErrors?.title?.[0]}
        />

        {/* Description textarea */}
        <FormInput
          id="task-description-input"
          as="textarea"
          name="description"
          label="Description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed explanation, acceptance criteria, or technical notes..."
          error={validationErrors?.description?.[0]}
        />

        {/* Status & Priority Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="task-status-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Status
            </label>
            <select
              id="task-status-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-priority-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Priority
            </label>
            <select
              id="task-priority-select"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <FormInput
          id="task-due-date-input"
          name="due_date"
          type="date"
          label="Due Date"
          value={formData.due_date}
          onChange={handleChange}
          error={validationErrors?.due_date?.[0]}
        />

        {/* Tags input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Tags & Categories
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <input
                id="task-tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                placeholder="Type tag and press Add..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button
              type="button"
              id="btn-add-tag"
              size="sm"
              variant="secondary"
              onClick={handleAddTag}
            >
              Add
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {formData.tags.map((tag) => (
                <TagBadge key={tag} label={tag} onRemove={handleRemoveTag} />
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            id="btn-cancel-task-form"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            id="btn-save-task"
            variant="primary"
            size="sm"
            isLoading={isMutating}
            leftIcon={isEditing ? Save : Plus}
          >
            {isEditing ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
