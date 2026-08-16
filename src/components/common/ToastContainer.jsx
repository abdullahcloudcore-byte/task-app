import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { clearTaskSuccess, clearTaskErrors, selectTaskSuccess, selectTaskErrors } from "../../features/tasks/tasksSlice";
import { clearSuccessMessage, clearAuthError, selectAuth } from "../../features/auth/authSlice";

export const ToastContainer = () => {
  const dispatch = useDispatch();
  const taskSuccess = useSelector(selectTaskSuccess);
  const { error: taskError } = useSelector(selectTaskErrors);
  const { successMessage: authSuccess, error: authError } = useSelector(selectAuth);

  const successMessage = taskSuccess || authSuccess;
  const errorMessage = taskError || authError;

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearTaskSuccess());
        dispatch(clearSuccessMessage());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  if (!successMessage && !errorMessage) return null;

  return (
    <div
      id="app-toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200"
    >
      {successMessage && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(clearTaskSuccess());
              dispatch(clearSuccessMessage());
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-rose-600 text-white rounded-xl shadow-xl border border-rose-700 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-200 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(clearTaskErrors());
              dispatch(clearAuthError());
            }}
            className="text-rose-200 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ToastContainer;
