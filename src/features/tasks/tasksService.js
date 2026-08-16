import apiClient from "../../services/api/axiosClient";

const tasksService = {
  // GET /api/tasks with query params (page, per_page, search, status, priority, sort)
  getTasks: async (params) => {
    return await apiClient.getTasks(params);
  },

  // GET /api/tasks/:id
  getTaskById: async (id) => {
    return await apiClient.getTaskById(id);
  },

  // POST /api/tasks
  createTask: async (taskData, user) => {
    return await apiClient.createTask(taskData, user);
  },

  // PUT /api/tasks/:id
  updateTask: async (id, taskData) => {
    return await apiClient.updateTask(id, taskData);
  },

  // PATCH /api/tasks/:id/toggle
  toggleTaskStatus: async (id) => {
    return await apiClient.toggleTaskStatus(id);
  },

  // DELETE /api/tasks/:id
  deleteTask: async (id) => {
    return await apiClient.deleteTask(id);
  }
};

export default tasksService;
