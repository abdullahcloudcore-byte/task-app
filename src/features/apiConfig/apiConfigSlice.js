import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getApiBaseUrl,
  setApiBaseUrl,
  getUseMockApi,
  setUseMockApi
} from "../../services/api/axiosClient";
import { mockLaravelServer } from "../../services/api/mockLaravelServer";

const initialState = {
  baseUrl: getApiBaseUrl(),
  useMockApi: getUseMockApi(),
  isGuideOpen: false,
  isApiLogsOpen: false,
  apiLogs: [],
  testStatus: "idle",
  testMessage: null
};

// Async Thunk: Test connection to real Laravel Backend
export const testLaravelConnection = createAsyncThunk(
  "apiConfig/testConnection",
  async (customUrl, { rejectWithValue }) => {
    const targetUrl = (customUrl || getApiBaseUrl()).replace(/\/$/, "");
    try {
      // Test basic endpoint
      const response = await axios.get(`${targetUrl}/tasks`, {
        headers: { Accept: "application/json" },
        timeout: 4000
      });
      return {
        url: targetUrl,
        status: response.status,
        message: `Connected successfully! Status ${response.status} OK.`
      };
    } catch (error) {
      if (error.response) {
        return {
          url: targetUrl,
          status: error.response.status,
          message: `Server responded with HTTP ${error.response.status} (${error.response.statusText || "Active"})`
        };
      }
      return rejectWithValue(
        error.code === "ECONNABORTED"
          ? "Connection timed out. Ensure Laravel server is running (php artisan serve)."
          : error.message || "Network error. Check CORS in config/cors.php"
      );
    }
  }
);

export const apiConfigSlice = createSlice({
  name: "apiConfig",
  initialState,
  reducers: {
    updateBaseUrl: (state, action) => {
      state.baseUrl = action.payload;
      setApiBaseUrl(action.payload);
    },
    toggleApiMode: (state, action) => {
      const mode = action.payload !== undefined ? action.payload : !state.useMockApi;
      state.useMockApi = mode;
      setUseMockApi(mode);
    },
    setGuideOpen: (state, action) => {
      state.isGuideOpen = action.payload;
    },
    setApiLogsOpen: (state, action) => {
      state.isApiLogsOpen = action.payload;
    },
    addApiLog: (state, action) => {
      state.apiLogs.unshift(action.payload);
      if (state.apiLogs.length > 50) {
        state.apiLogs.pop();
      }
    },
    clearApiLogs: (state) => {
      state.apiLogs = [];
      localStorage.removeItem("laravel_api_request_logs");
    },
    resetMockDatabase: () => {
      mockLaravelServer.resetDatabase();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(testLaravelConnection.pending, (state) => {
        state.testStatus = "testing";
        state.testMessage = "Testing connection to Laravel server...";
      })
      .addCase(testLaravelConnection.fulfilled, (state, action) => {
        state.testStatus = "success";
        state.testMessage = action.payload.message;
      })
      .addCase(testLaravelConnection.rejected, (state, action) => {
        state.testStatus = "error";
        state.testMessage = action.payload || "Could not connect to Laravel server.";
      });
  }
});

export const {
  updateBaseUrl,
  toggleApiMode,
  setGuideOpen,
  setApiLogsOpen,
  addApiLog,
  clearApiLogs,
  resetMockDatabase
} = apiConfigSlice.actions;

export const selectApiConfig = (state) => state.apiConfig;

export default apiConfigSlice.reducer;
