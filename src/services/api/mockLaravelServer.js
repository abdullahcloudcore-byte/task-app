import { initialTasks, initialUsers } from "../../utils/sampleData";

const STORAGE_KEYS = {
  TASKS: "laravel_tasks_db",
  USERS: "laravel_users_db",
  LOGS: "laravel_api_request_logs"
};

// Initialize DB in localStorage if not present
const getStoredTasks = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
    return [...initialTasks];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [...initialTasks];
  }
};

const saveStoredTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

const getStoredUsers = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    return [...initialUsers];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [...initialUsers];
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const logApiCall = (method, endpoint, paramsOrBody, status, responseData) => {
  const logEntry = {
    id: Date.now() + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    method: method.toUpperCase(),
    endpoint,
    payload: paramsOrBody,
    status,
    response: responseData
  };
  try {
    const existingLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || "[]");
    const updatedLogs = [logEntry, ...existingLogs.slice(0, 49)];
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));
    window.dispatchEvent(new CustomEvent("laravel_api_log", { detail: logEntry }));
  } catch {
    // Ignore storage issues
  }
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockLaravelServer = {
  // Reset demo database to initial seed data
  resetDatabase: () => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    return true;
  },

  // AUTH: POST /api/register
  register: async ({ name, email, password, password_confirmation }) => {
    await delay(350);
    const users = getStoredUsers();

    // Validation checks matching Laravel FormRequest
    const errors = {};
    if (!name || name.trim().length < 2) {
      errors.name = ["The name field is required and must be at least 2 characters."];
    }
    if (!email || !email.includes("@")) {
      errors.email = ["The email field must be a valid email address."];
    } else if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      errors.email = ["The email has already been taken."];
    }
    if (!password || password.length < 6) {
      errors.password = ["The password must be at least 6 characters."];
    }
    if (password_confirmation !== undefined && password !== password_confirmation) {
      errors.password_confirmation = ["The password confirmation does not match."];
    }

    if (Object.keys(errors).length > 0) {
      const errorResponse = {
        message: "The given data was invalid.",
        errors
      };
      logApiCall("POST", "/api/register", { name, email }, 422, errorResponse);
      const err = new Error("The given data was invalid.");
      err.response = { status: 422, data: errorResponse };
      throw err;
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    saveStoredUsers(users);

    const token = `sanctum_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const responseData = {
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      },
      token
    };

    logApiCall("POST", "/api/register", { name, email }, 201, responseData);
    return responseData;
  },

  // AUTH: POST /api/login
  login: async ({ email, password }) => {
    await delay(300);
    const users = getStoredUsers();

    const user = users.find(
      (u) => u.email.toLowerCase() === (email || "").toLowerCase()
    );

    if (!user || user.password !== password) {
      const errorResponse = {
        message: "These credentials do not match our records.",
        errors: {
          email: ["These credentials do not match our records."]
        }
      };
      logApiCall("POST", "/api/login", { email }, 422, errorResponse);
      const err = new Error("These credentials do not match our records.");
      err.response = { status: 422, data: errorResponse };
      throw err;
    }

    const token = `sanctum_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const responseData = {
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      token
    };

    logApiCall("POST", "/api/login", { email }, 200, responseData);
    return responseData;
  },

  // AUTH: POST /api/logout
  logout: async (token) => {
    await delay(200);
    const responseData = { message: "Tokens successfully revoked." };
    logApiCall("POST", "/api/logout", { token: token ? "Bearer ***" : null }, 200, responseData);
    return responseData;
  },

  // AUTH: GET /api/user
  getUser: async (token) => {
    await delay(250);
    if (!token) {
      const err = new Error("Unauthenticated.");
      err.response = { status: 401, data: { message: "Unauthenticated." } };
      logApiCall("GET", "/api/user", null, 401, err.response.data);
      throw err;
    }

    const users = getStoredUsers();
    // Return first user or default
    const user = users[0] || initialUsers[0];
    const responseData = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };

    logApiCall("GET", "/api/user", null, 200, responseData);
    return responseData;
  },

  // TASKS: GET /api/tasks (Laravel Resource Paginated)
  getTasks: async (params = {}) => {
    await delay(250);
    const {
      page = 1,
      per_page = 6,
      search = "",
      status = "",
      priority = "",
      sort = "created_at_desc"
    } = params;

    let tasks = getStoredTasks();

    // Search filter
    if (search && search.trim()) {
      const query = search.trim().toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query)) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Status filter
    if (status && status !== "all") {
      tasks = tasks.filter((t) => t.status === status);
    }

    // Priority filter
    if (priority && priority !== "all") {
      tasks = tasks.filter((t) => t.priority === priority);
    }

    // Sorting
    tasks.sort((a, b) => {
      if (sort === "created_at_asc") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sort === "due_date_asc") {
        return new Date(a.due_date || "9999") - new Date(b.due_date || "9999");
      }
      if (sort === "due_date_desc") {
        return new Date(b.due_date || "0000") - new Date(a.due_date || "0000");
      }
      if (sort === "priority_desc") {
        const pOrder = { high: 3, medium: 2, low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      // default: created_at_desc
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const total = tasks.length;
    const limit = parseInt(per_page, 10) || 6;
    const currentPage = parseInt(page, 10) || 1;
    const lastPage = Math.max(1, Math.ceil(total / limit));
    const normalizedPage = Math.min(Math.max(1, currentPage), lastPage);

    const startIndex = (normalizedPage - 1) * limit;
    const paginatedItems = tasks.slice(startIndex, startIndex + limit);

    // Build standard Laravel Resource Pagination Object
    const from = total === 0 ? 0 : startIndex + 1;
    const to = total === 0 ? 0 : Math.min(startIndex + limit, total);

    const paginationLinks = [
      {
        url: normalizedPage > 1 ? `/api/tasks?page=${normalizedPage - 1}` : null,
        label: "&laquo; Previous",
        active: false
      }
    ];

    for (let i = 1; i <= lastPage; i++) {
      paginationLinks.push({
        url: `/api/tasks?page=${i}`,
        label: `${i}`,
        active: i === normalizedPage
      });
    }

    paginationLinks.push({
      url: normalizedPage < lastPage ? `/api/tasks?page=${normalizedPage + 1}` : null,
      label: "Next &raquo;",
      active: false
    });

    const responseData = {
      data: paginatedItems,
      links: {
        first: `/api/tasks?page=1`,
        last: `/api/tasks?page=${lastPage}`,
        prev: normalizedPage > 1 ? `/api/tasks?page=${normalizedPage - 1}` : null,
        next: normalizedPage < lastPage ? `/api/tasks?page=${normalizedPage + 1}` : null
      },
      meta: {
        current_page: normalizedPage,
        from,
        last_page: lastPage,
        links: paginationLinks,
        path: "/api/tasks",
        per_page: limit,
        to,
        total
      }
    };

    logApiCall("GET", "/api/tasks", params, 200, {
      total_count: total,
      returned_count: paginatedItems.length,
      current_page: normalizedPage
    });

    return responseData;
  },

  // TASKS: GET /api/tasks/{id} (View single task)
  getTaskById: async (id) => {
    await delay(200);
    const tasks = getStoredTasks();
    const task = tasks.find((t) => String(t.id) === String(id));

    if (!task) {
      const errorResponse = { message: `Task #${id} not found.` };
      logApiCall("GET", `/api/tasks/${id}`, null, 404, errorResponse);
      const err = new Error("Task not found.");
      err.response = { status: 404, data: errorResponse };
      throw err;
    }

    const responseData = { data: task };
    logApiCall("GET", `/api/tasks/${id}`, null, 200, responseData);
    return responseData;
  },

  // TASKS: POST /api/tasks (Create new task)
  createTask: async (taskData, user) => {
    await delay(350);
    const { title, description, priority = "medium", status = "pending", due_date, tags = [] } = taskData;

    // Validation
    const errors = {};
    if (!title || !title.trim()) {
      errors.title = ["The title field is required."];
    } else if (title.trim().length < 3) {
      errors.title = ["The title must be at least 3 characters."];
    }

    if (Object.keys(errors).length > 0) {
      const errorResponse = { message: "The given data was invalid.", errors };
      logApiCall("POST", "/api/tasks", taskData, 422, errorResponse);
      const err = new Error("The given data was invalid.");
      err.response = { status: 422, data: errorResponse };
      throw err;
    }

    const tasks = getStoredTasks();
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => Number(t.id) || 0)) + 1 : 1;

    const newTask = {
      id: newId,
      title: title.trim(),
      description: description ? description.trim() : "",
      status: status || "pending",
      priority: priority || "medium",
      due_date: due_date || null,
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user?.id || 1,
      author: user?.name || "Alex Morgan"
    };

    tasks.unshift(newTask);
    saveStoredTasks(tasks);

    const responseData = {
      message: "Task created successfully.",
      data: newTask
    };

    logApiCall("POST", "/api/tasks", taskData, 201, responseData);
    return responseData;
  },

  // TASKS: PUT /api/tasks/{id} (Update task)
  updateTask: async (id, taskData) => {
    await delay(350);
    const { title, description, priority, status, due_date, tags } = taskData;

    // Validation
    const errors = {};
    if (title !== undefined && (!title || !title.trim())) {
      errors.title = ["The title field cannot be empty."];
    }

    if (Object.keys(errors).length > 0) {
      const errorResponse = { message: "The given data was invalid.", errors };
      logApiCall("PUT", `/api/tasks/${id}`, taskData, 422, errorResponse);
      const err = new Error("The given data was invalid.");
      err.response = { status: 422, data: errorResponse };
      throw err;
    }

    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => String(t.id) === String(id));

    if (index === -1) {
      const errorResponse = { message: `Task #${id} not found.` };
      logApiCall("PUT", `/api/tasks/${id}`, taskData, 404, errorResponse);
      const err = new Error("Task not found.");
      err.response = { status: 404, data: errorResponse };
      throw err;
    }

    const existing = tasks[index];
    const updated = {
      ...existing,
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(due_date !== undefined && { due_date }),
      ...(tags !== undefined && {
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()).filter(Boolean) : []
      }),
      updated_at: new Date().toISOString()
    };

    tasks[index] = updated;
    saveStoredTasks(tasks);

    const responseData = {
      message: "Task updated successfully.",
      data: updated
    };

    logApiCall("PUT", `/api/tasks/${id}`, taskData, 200, responseData);
    return responseData;
  },

  // TASKS: PATCH /api/tasks/{id}/toggle (Quick toggle status)
  toggleStatus: async (id) => {
    await delay(200);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => String(t.id) === String(id));

    if (index === -1) {
      const err = new Error("Task not found.");
      err.response = { status: 404, data: { message: `Task #${id} not found.` } };
      throw err;
    }

    const current = tasks[index];
    const newStatus = current.status === "completed" ? "pending" : "completed";
    tasks[index] = {
      ...current,
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    saveStoredTasks(tasks);
    const responseData = {
      message: `Task marked as ${newStatus}.`,
      data: tasks[index]
    };

    logApiCall("PATCH", `/api/tasks/${id}/toggle`, { status: newStatus }, 200, responseData);
    return responseData;
  },

  // TASKS: DELETE /api/tasks/{id} (Delete task)
  deleteTask: async (id) => {
    await delay(250);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => String(t.id) === String(id));

    if (index === -1) {
      const err = new Error("Task not found.");
      err.response = { status: 404, data: { message: `Task #${id} not found.` } };
      throw err;
    }

    tasks.splice(index, 1);
    saveStoredTasks(tasks);

    const responseData = { message: "Task deleted successfully." };
    logApiCall("DELETE", `/api/tasks/${id}`, null, 200, responseData);
    return responseData;
  }
};
