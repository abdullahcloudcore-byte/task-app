import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckSquare,
  Plus,
  Server,
  Terminal,
  LogOut,
  LogIn,
  User,
  Zap,
  ChevronDown
} from "lucide-react";
import Button from "./Button";
import { selectAuth, logoutUser } from "../../features/auth/authSlice";
import {
  selectApiConfig,
  setGuideOpen,
  setApiLogsOpen
} from "../../features/apiConfig/apiConfigSlice";

export const Navbar = ({ onOpenCreateTask, onOpenAuth }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const { useMockApi, baseUrl } = useSelector(selectApiConfig);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                  Task Manager
                </span>
                <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900 font-mono">
                  Laravel REST API
                </span>
              </div>
              <p className="text-2xs text-slate-400 font-medium hidden sm:block">
                Redux Toolkit Architecture • Feature-Wise Modules
              </p>
            </div>
          </div>

          {/* Right: Driver Status, Guide & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Driver Badge Button */}
            <button
              type="button"
              id="nav-driver-status-btn"
              onClick={() => dispatch(setGuideOpen(true))}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                useMockApi
                  ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900 hover:bg-amber-100"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900 hover:bg-emerald-100"
              }`}
              title="Click to configure Laravel endpoints"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{useMockApi ? "Mock Sandbox" : "Live Laravel"}</span>
            </button>

            {/* Laravel API Bridge / Guide Button */}
            <Button
              id="nav-laravel-bridge-btn"
              variant="secondary"
              size="sm"
              onClick={() => dispatch(setGuideOpen(true))}
              leftIcon={Server}
              className="hidden lg:inline-flex"
            >
              Laravel Bridge
            </Button>

            {/* HTTP Logs */}
            <Button
              id="nav-api-logs-btn"
              variant="secondary"
              size="sm"
              onClick={() => dispatch(setApiLogsOpen(true))}
              leftIcon={Terminal}
              className="hidden sm:inline-flex"
            >
              API Logs
            </Button>

            {/* + New Task Button */}
            <Button
              id="nav-create-task-btn"
              variant="primary"
              size="sm"
              onClick={onOpenCreateTask}
              leftIcon={Plus}
            >
              New Task
            </Button>

            {/* Auth / User profile */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  id="user-menu-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-3xs text-slate-400 leading-tight">{user.email}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-2xs truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-3xs font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                        Sanctum Authenticated
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        dispatch(setGuideOpen(true));
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <Server className="w-3.5 h-3.5 text-slate-400" />
                      Laravel API Config
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        dispatch(setApiLogsOpen(true));
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <Terminal className="w-3.5 h-3.5 text-slate-400" />
                      Telemetry Logs
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      type="button"
                      id="btn-logout"
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out (POST /api/logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                id="nav-login-btn"
                variant="primary"
                size="sm"
                onClick={onOpenAuth}
                leftIcon={LogIn}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
