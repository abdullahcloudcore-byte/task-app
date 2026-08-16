import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import apiConfigReducer from "../features/apiConfig/apiConfigSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
  apiConfig: apiConfigReducer
});

export default rootReducer;
