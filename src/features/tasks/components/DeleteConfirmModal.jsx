import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { deleteTask, selectTasksMutating } from "../tasksSlice";

export const DeleteConfirmModal = ({ isOpen, onClose, task }) => {
  const dispatch = useDispatch();
  const isMutating = useSelector(selectTasksMutating);

  if (!task) return null;

  const handleDelete = async () => {
    const result = await dispatch(deleteTask(task.id));
    if (deleteTask.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <Modal
      id="delete-task-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title="Delete Task"
      subtitle="Sends DELETE /api/tasks/:id request to Laravel"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-sm">Are you sure?</p>
            <p className="mt-1">
              You are about to delete <span className="font-bold">"{task.title}"</span>. This action will permanently remove it from the Laravel database.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            id="cancel-delete-task-btn"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            id="confirm-delete-task-btn"
            variant="danger"
            size="sm"
            isLoading={isMutating}
            onClick={handleDelete}
            leftIcon={Trash2}
          >
            Yes, Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
