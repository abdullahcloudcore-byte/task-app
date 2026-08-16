import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { loginUser, clearAuthError, selectAuth } from "../authSlice";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";

export const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const { isSubmitting, error, validationErrors } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    email: "alex@example.com",
    password: "password123"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form id="laravel-login-form" onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-rose-600 dark:text-rose-400 mt-0.5">
              Simulating Laravel Sanctum token endpoint: <code className="px-1 py-0.5 bg-rose-100 dark:bg-rose-900/50 rounded font-mono text-xs">POST /api/login</code>
            </p>
          </div>
        </div>
      )}

      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300">
        <span className="font-semibold text-slate-900 dark:text-slate-100">Quick Test Credentials:</span>
        <div className="mt-1 flex items-center justify-between text-2xs">
          <span>Email: <code className="text-indigo-600 dark:text-indigo-400 font-mono">alex@example.com</code></span>
          <span>Password: <code className="text-indigo-600 dark:text-indigo-400 font-mono">password123</code></span>
        </div>
      </div>

      <FormInput
        id="login-email"
        name="email"
        type="email"
        label="Email Address"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="you@domain.com"
        error={validationErrors?.email?.[0]}
        leftIcon={Mail}
      />

      <FormInput
        id="login-password"
        name="password"
        type="password"
        label="Password"
        required
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={validationErrors?.password?.[0]}
        leftIcon={Lock}
      />

      <div className="pt-2">
        <Button
          id="btn-submit-login"
          type="submit"
          variant="primary"
          className="w-full"
          size="md"
          isLoading={isSubmitting}
          leftIcon={LogIn}
        >
          Sign In to Laravel
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <button
            type="button"
            id="btn-switch-register"
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2 dark:text-indigo-400"
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
