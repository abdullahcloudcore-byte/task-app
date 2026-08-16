import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, RefreshCw, Loader2, Server, Terminal, ShieldCheck } from "lucide-react";
import TaskStatsSummary from "../components/TaskStatsSummary";
import TaskFilters from "../components/TaskFilters";
import TaskCard from "../components/TaskCard";
import TaskTable from "../components/TaskTable";
import TaskPagination from "../components/TaskPagination";
import TaskFormModal from "../components/TaskFormModal";
import TaskViewModal from "../components/TaskViewModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../../../components/common/EmptyState";
import Button from "../../../components/common/Button";
import {
  fetchTasks,
  toggleTaskStatus,
  selectTasks,
  selectFilters,
  selectViewMode,
  selectTasksLoading,
  resetFilters
} from "../tasksSlice";
import { selectAuth } from "../../auth/authSlice";
import { selectApiConfig, setGuideOpen, setApiLogsOpen } from "../../apiConfig/apiConfigSlice";

export const TasksDashboardPage = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  onOpenAuth
}) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const filters = useSelector(selectFilters);
  const viewMode = useSelector(selectViewMode);
  const isLoading = useSelector(selectTasksLoading);
  const { isAuthenticated, user } = useSelector(selectAuth);
  const { useMockApi, baseUrl } = useSelector(selectApiConfig);

  // Modal states
  const [selectedTaskForView, setSelectedTaskForView] = useState(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState(null);

  // Trigger fetch when query parameters change (Laravel standard index pagination)
  useEffect(() => {
    dispatch(fetchTasks());
  }, [
    dispatch,
    filters.page,
    filters.per_page,
    filters.search,
    filters.status,
    filters.priority,
    filters.sort
  ]);

  const handleRefresh = () => {
    dispatch(fetchTasks());
  };

  const handleToggleStatus = (taskId) => {
    dispatch(toggleTaskStatus(taskId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Welcome & Architecture overview */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-700/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-3xs font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Laravel Sanctum & Resource API
            </span>
            <span className="flex items-center gap-1 text-2xs text-indigo-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isAuthenticated ? `Logged in as ${user?.name || "User"}` : "Guest Mode"}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Task Management Dashboard
          </h1>
          <p className="text-xs text-indigo-100/80 mt-1 max-w-xl leading-relaxed">
            Built with React & Redux Toolkit adhering to Laravel RESTful conventions: paginated index queries, Resource collections, and token-based state management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <Button
            id="hero-laravel-guide-btn"
            variant="secondary"
            size="sm"
            onClick={() => dispatch(setGuideOpen(true))}
            leftIcon={Server}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
          >
            Laravel API Config
          </Button>

          <Button
            id="hero-create-task-btn"
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={Plus}
            className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-600/30"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Task Statistics Summary Cards */}
      <TaskStatsSummary />

      {/* Task Search & Filter Bar */}
      <TaskFilters />

      {/* Main Content Area */}
      <div>
        {/* Section header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Task Collection
            </h2>
            {isLoading && (
              <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Fetching...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              id="refresh-tasks-btn"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              isLoading={isLoading}
              leftIcon={RefreshCw}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && tasks.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-5 w-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks match your filters"
            description="Try adjusting your search criteria, clearing the filters, or adding a new task to your Laravel database."
            actionLabel="Create New Task"
            onAction={() => setIsCreateModalOpen(true)}
            onResetFilters={() => dispatch(resetFilters())}
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={(t) => setSelectedTaskForView(t)}
                onEdit={(t) => setSelectedTaskForEdit(t)}
                onDelete={(t) => setSelectedTaskForDelete(t)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <TaskTable
            tasks={tasks}
            onView={(t) => setSelectedTaskForView(t)}
            onEdit={(t) => setSelectedTaskForEdit(t)}
            onDelete={(t) => setSelectedTaskForDelete(t)}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Laravel Standard Pagination Bar */}
        <TaskPagination />
      </div>

      {/* Task Form Modal (Create) */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Task Form Modal (Edit) */}
      <TaskFormModal
        isOpen={Boolean(selectedTaskForEdit)}
        onClose={() => setSelectedTaskForEdit(null)}
        initialData={selectedTaskForEdit}
      />

      {/* Task View Modal */}
      <TaskViewModal
        isOpen={Boolean(selectedTaskForView)}
        onClose={() => setSelectedTaskForView(null)}
        task={selectedTaskForView}
        onEdit={(t) => {
          setSelectedTaskForView(null);
          setSelectedTaskForEdit(t);
        }}
        onDelete={(t) => {
          setSelectedTaskForView(null);
          setSelectedTaskForDelete(t);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(selectedTaskForDelete)}
        onClose={() => setSelectedTaskForDelete(null)}
        task={selectedTaskForDelete}
      />
    </div>
  );
};

export default TasksDashboardPage;
