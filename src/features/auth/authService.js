import apiClient, { setAuthToken, getAuthToken } from "../../services/api/axiosClient";

const authService = {
  login: async (credentials) => {
    const data = await apiClient.login(credentials);
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  register: async (userData) => {
    const data = await apiClient.register(userData);
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      const data = await apiClient.logout();
      setAuthToken(null);
      return data;
    } catch (error) {
      setAuthToken(null);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No token stored.");
    }
    const data = await apiClient.getUser();
    return data;
  },

  getStoredToken: () => getAuthToken()
};

export default authService;
