import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tasksService from "./tasksService";
import { extractLaravelErrorMessage } from "../../utils/formatters";

const initialState = {
  items: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 6,
    total: 0,
    from: 0,
    to: 0,
    links: []
  },
  activeTask: null,
  filters: {
    page: 1,
    per_page: 6,
    search: "",
    status: "all",
    priority: "all",
    sort: "created_at_desc"
  },
  viewMode: "grid", // 'grid' | 'table'
  isLoading: false,
  isDetailLoading: false,
  isMutating: false,
  error: null,
  validationErrors: {},
  successMessage: null
};

// Async Thunk: Fetch Tasks (Laravel Paginated collection)
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().tasks;
      const response = await tasksService.getTasks(filters);
      return response;
    } catch (error) {
      return rejectWithValue(extractLaravelErrorMessage(error, "Failed to load tasks."));
    }
  }
);

// Async Thunk: Fetch Single Task (GET /api/tasks/:id)
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await tasksService.getTaskById(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(extractLaravelErrorMessage(error, `Failed to load task #${id}.`));
    }
  }
);

// Async Thunk: Create Task (POST /api/tasks)
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { getState, dispatch, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const response = await tasksService.createTask(taskData, user);
      // Automatically refresh tasks list
      dispatch(fetchTasks());
      return response;
    } catch (error) {
      const message = extractLaravelErrorMessage(error, "Failed to create task.");
      const validationErrors = error.response?.data?.errors || {};
      return rejectWithValue({ message, validationErrors });
    }
  }
);

// Async Thunk: Update Task (PUT /api/tasks/:id)
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await tasksService.updateTask(id, data);
      dispatch(fetchTasks());
      return response;
    } catch (error) {
      const message = extractLaravelErrorMessage(error, `Failed to update task #${id}.`);
      const validationErrors = error.response?.data?.errors || {};
      return rejectWithValue({ message, validationErrors });
    }
  }
);

// Async Thunk: Toggle Status (PATCH /api/tasks/:id/toggle)
export const toggleTaskStatus = createAsyncThunk(
  "tasks/toggleTaskStatus",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await tasksService.toggleTaskStatus(id);
      dispatch(fetchTasks());
      return response;
    } catch (error) {
      return rejectWithValue(extractLaravelErrorMessage(error, "Failed to update task status."));
    }
  }
);

// Async Thunk: Delete Task (DELETE /api/tasks/:id)
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await tasksService.deleteTask(id);
      dispatch(fetchTasks());
      return { id, message: response.message || "Task deleted successfully." };
    } catch (error) {
      return rejectWithValue(extractLaravelErrorMessage(error, "Failed to delete task."));
    }
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.filters.per_page = action.payload;
      state.filters.page = 1; // Reset to first page
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setPriorityFilter: (state, action) => {
      state.filters.priority = action.payload;
      state.filters.page = 1;
    },
    setSortOrder: (state, action) => {
      state.filters.sort = action.payload;
      state.filters.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        per_page: state.filters.per_page,
        search: "",
        status: "all",
        priority: "all",
        sort: "created_at_desc"
      };
    },
    setActiveTask: (state, action) => {
      state.activeTask = action.payload;
    },
    clearActiveTask: (state) => {
      state.activeTask = null;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearTaskErrors: (state) => {
      state.error = null;
      state.validationErrors = {};
    },
    clearTaskSuccess: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks List
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Standard Laravel Resource Collection: { data: [...], meta: {...}, links: {...} }
        // or direct pagination object { data: [...], current_page: 1, ... }
        if (action.payload?.data) {
          state.items = action.payload.data;
          state.pagination = action.payload.meta || {
            current_page: action.payload.current_page || 1,
            last_page: action.payload.last_page || 1,
            per_page: action.payload.per_page || 6,
            total: action.payload.total || action.payload.data.length,
            from: action.payload.from || 1,
            to: action.payload.to || action.payload.data.length,
            links: action.payload.links || []
          };
        } else if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.pagination.total = action.payload.length;
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load tasks.";
      })

      // Fetch Single Task
      .addCase(fetchTaskById.pending, (state) => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.activeTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isMutating = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isMutating = false;
        state.successMessage = action.payload?.message || "Task created successfully!";
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload?.message || "Failed to create task.";
        state.validationErrors = action.payload?.validationErrors || {};
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.isMutating = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isMutating = false;
        state.successMessage = action.payload?.message || "Task updated successfully!";
        if (state.activeTask && action.payload?.data) {
          state.activeTask = action.payload.data;
        }
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload?.message || "Failed to update task.";
        state.validationErrors = action.payload?.validationErrors || {};
      })

      // Toggle Status
      .addCase(toggleTaskStatus.pending, () => {
        // Subtle optimistic handling or quiet mutation
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        state.successMessage = action.payload?.message || "Task status updated.";
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update status.";
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isMutating = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isMutating = false;
        state.successMessage = action.payload?.message || "Task removed.";
        if (state.activeTask && String(state.activeTask.id) === String(action.payload.id)) {
          state.activeTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload || "Failed to delete task.";
      });
  }
});

export const {
  setPage,
  setPerPage,
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setSortOrder,
  resetFilters,
  setActiveTask,
  clearActiveTask,
  setViewMode,
  clearTaskErrors,
  clearTaskSuccess
} = tasksSlice.actions;

export const selectTasks = (state) => state.tasks.items;
export const selectPagination = (state) => state.tasks.pagination;
export const selectFilters = (state) => state.tasks.filters;
export const selectActiveTask = (state) => state.tasks.activeTask;
export const selectTasksLoading = (state) => state.tasks.isLoading;
export const selectTasksMutating = (state) => state.tasks.isMutating;
export const selectViewMode = (state) => state.tasks.viewMode;
export const selectTaskErrors = (state) => ({
  error: state.tasks.error,
  validationErrors: state.tasks.validationErrors
});
export const selectTaskSuccess = (state) => state.tasks.successMessage;

export default tasksSlice.reducer;
