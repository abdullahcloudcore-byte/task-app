import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Lock, UserPlus, AlertCircle } from "lucide-react";
import { registerUser, clearAuthError, selectAuth } from "../authSlice";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";

export const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const { isSubmitting, error, validationErrors } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
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
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form id="laravel-register-form" onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-rose-600 dark:text-rose-400 mt-0.5">
              Simulating Laravel Endpoint: <code className="px-1 py-0.5 bg-rose-100 dark:bg-rose-900/50 rounded font-mono text-xs">POST /api/register</code>
            </p>
          </div>
        </div>
      )}

      <FormInput
        id="register-name"
        name="name"
        type="text"
        label="Full Name"
        required
        value={formData.name}
        onChange={handleChange}
        placeholder="Sarah Connor"
        error={validationErrors?.name?.[0]}
        leftIcon={User}
      />

      <FormInput
        id="register-email"
        name="email"
        type="email"
        label="Email Address"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="sarah@example.com"
        error={validationErrors?.email?.[0]}
        leftIcon={Mail}
      />

      <FormInput
        id="register-password"
        name="password"
        type="password"
        label="Password"
        required
        value={formData.password}
        onChange={handleChange}
        placeholder="Minimum 6 characters"
        error={validationErrors?.password?.[0]}
        leftIcon={Lock}
      />

      <FormInput
        id="register-password-confirmation"
        name="password_confirmation"
        type="password"
        label="Confirm Password"
        required
        value={formData.password_confirmation}
        onChange={handleChange}
        placeholder="Re-type password"
        error={validationErrors?.password_confirmation?.[0]}
        leftIcon={Lock}
      />

      <div className="pt-2">
        <Button
          id="btn-submit-register"
          type="submit"
          variant="primary"
          className="w-full"
          size="md"
          isLoading={isSubmitting}
          leftIcon={UserPlus}
        >
          Create Account & Sign In
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Already registered with Laravel?{" "}
          <button
            type="button"
            id="btn-switch-login"
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2 dark:text-indigo-400"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
