import axios from "axios";
import { mockLaravelServer } from "./mockLaravelServer";

// Default configuration keys
const API_BASE_URL_KEY = "laravel_api_base_url";
const USE_MOCK_API_KEY = "laravel_use_mock_api";
const AUTH_TOKEN_KEY = "laravel_auth_token";

export const getApiBaseUrl = () => {
  return localStorage.getItem(API_BASE_URL_KEY) || "http://localhost:8000/api";
};

export const setApiBaseUrl = (url) => {
  localStorage.setItem(API_BASE_URL_KEY, url);
};

export const getUseMockApi = () => {
  const value = localStorage.getItem(USE_MOCK_API_KEY);
  return value === null ? true : value === "true";
};

export const setUseMockApi = (useMock) => {
  localStorage.setItem(USE_MOCK_API_KEY, String(useMock));
};

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Create real Axios instance
const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  timeout: 10000
});

// Request interceptor: Attach Sanctum Bearer Token
axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthenticated
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto clear token on 401
      setAuthToken(null);
      window.dispatchEvent(new CustomEvent("laravel_unauthorized"));
    }
    return Promise.reject(error);
  }
);

/**
 * Unified API Client
 * Routes requests to either Live Axios or Mock Laravel Server based on configuration
 */
export const apiClient = {
  // Authentication
  login: async (credentials) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.login(credentials);
    }
    const response = await axiosInstance.post("/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.register(userData);
    }
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  },

  logout: async () => {
    const token = getAuthToken();
    if (getUseMockApi()) {
      return await mockLaravelServer.logout(token);
    }
    try {
      const response = await axiosInstance.post("/logout");
      return response.data;
    } catch (e) {
      // Fallback response even if network fails during logout
      return { message: "Logged out" };
    }
  },

  getUser: async () => {
    const token = getAuthToken();
    if (getUseMockApi()) {
      return await mockLaravelServer.getUser(token);
    }
    const response = await axiosInstance.get("/user");
    return response.data;
  },

  // Task Resource Endpoints (Standard Laravel REST)
  getTasks: async (params = {}) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.getTasks(params);
    }
    const response = await axiosInstance.get("/tasks", { params });
    return response.data;
  },

  getTaskById: async (id) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.getTaskById(id);
    }
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData, user) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.createTask(taskData, user);
    }
    const response = await axiosInstance.post("/tasks", taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.updateTask(id, taskData);
    }
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  toggleTaskStatus: async (id) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.toggleStatus(id);
    }
    const response = await axiosInstance.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  deleteTask: async (id) => {
    if (getUseMockApi()) {
      return await mockLaravelServer.deleteTask(id);
    }
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default apiClient;
