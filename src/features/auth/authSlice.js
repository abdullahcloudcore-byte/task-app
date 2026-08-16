import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { extractLaravelErrorMessage } from "../../utils/formatters";

// Retrieve initial token if present
const storedToken = authService.getStoredToken();

const initialState = {
  user: storedToken
    ? { id: 1, name: "Alex Morgan", email: "alex@example.com" }
    : { id: 1, name: "Alex Morgan", email: "alex@example.com" }, // default logged-in demo user for immediate exploration
  token: storedToken || "sanctum_demo_token_alex",
  isAuthenticated: true,
  isLoading: false,
  isSubmitting: false,
  error: null,
  validationErrors: {},
  successMessage: null
};

// Async Thunk: Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      const message = extractLaravelErrorMessage(error, "Login failed. Please check your credentials.");
      const validationErrors = error.response?.data?.errors || {};
      return rejectWithValue({ message, validationErrors });
    }
  }
);

// Async Thunk: Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      const message = extractLaravelErrorMessage(error, "Registration failed. Please check form inputs.");
      const validationErrors = error.response?.data?.errors || {};
      return rejectWithValue({ message, validationErrors });
    }
  }
);

// Async Thunk: Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.logout();
      return data;
    } catch (error) {
      return rejectWithValue(extractLaravelErrorMessage(error, "Logout error."));
    }
  }
);

// Async Thunk: Fetch Current User (GET /api/user)
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getCurrentUser();
      return data;
    } catch (error) {
      return rejectWithValue(extractLaravelErrorMessage(error, "Session expired."));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.validationErrors = {};
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.validationErrors = {};
      state.isLoading = false;
      state.isSubmitting = false;
    },
    setDemoAccount: (state, action) => {
      const user = action.payload || { id: 1, name: "Alex Morgan", email: "alex@example.com" };
      state.user = user;
      state.token = "sanctum_demo_token_alex";
      state.isAuthenticated = true;
      state.error = null;
      state.validationErrors = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.validationErrors = {};
        state.successMessage = action.payload.message || "Welcome back!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload?.message || "Login failed.";
        state.validationErrors = action.payload?.validationErrors || {};
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.validationErrors = {};
        state.successMessage = action.payload.message || "Account created successfully!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload?.message || "Registration failed.";
        state.validationErrors = action.payload?.validationErrors || {};
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        // Keep authenticated if demo mode, else reset
      });
  }
});

export const { clearAuthError, clearSuccessMessage, resetAuthState, setDemoAccount } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
