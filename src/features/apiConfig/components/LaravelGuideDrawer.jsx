import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Server,
  Code2,
  CheckCircle,
  Copy,
  Terminal,
  Layers,
  Database,
  ExternalLink,
  Activity,
  RefreshCw,
  Zap
} from "lucide-react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import {
  selectApiConfig,
  updateBaseUrl,
  toggleApiMode,
  setGuideOpen,
  setApiLogsOpen,
  testLaravelConnection,
  resetMockDatabase
} from "../apiConfigSlice";
import { fetchTasks } from "../../tasks/tasksSlice";

export const LaravelGuideDrawer = () => {
  const dispatch = useDispatch();
  const { baseUrl, useMockApi, isGuideOpen, testStatus, testMessage } = useSelector(selectApiConfig);

  const [activeTab, setActiveTab] = useState("config");
  const [copiedKey, setCopiedKey] = useState(null);
  const [inputUrl, setInputUrl] = useState(baseUrl);

  if (!isGuideOpen) return null;

  const handleCopy = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    dispatch(updateBaseUrl(inputUrl));
    dispatch(fetchTasks());
  };

  const handleTest = () => {
    dispatch(testLaravelConnection(inputUrl));
  };

  const handleResetData = () => {
    dispatch(resetMockDatabase());
    dispatch(fetchTasks());
  };

  const laravelRoutesCode = `// routes/api.php
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\TaskController;
use Illuminate\\Support\\Facades\\Route;

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Sanctum Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Task Resource CRUD & Pagination
    Route::apiResource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/toggle', [TaskController::class, 'toggleStatus']);
});`;

  const laravelControllerCode = `// app/Http/Controllers/TaskController.php
namespace App\\Http\\Controllers;

use App\\Models\\Task;
use App\\Http\\Resources\\TaskResource;
use Illuminate\\Http\\Request;

class TaskController extends Controller
{
    // GET /api/tasks?page=1&per_page=6&search=...&status=...
    public function index(Request $request)
    {
        $query = Task::query();

        // Search Scope
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status Filter
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Priority Filter
        if ($priority = $request->input('priority')) {
            if ($priority !== 'all') {
                $query->where('priority', $priority);
            }
        }

        // Sorting
        $sort = $request->input('sort', 'created_at_desc');
        match ($sort) {
            'created_at_asc' => $query->oldest(),
            'due_date_asc' => $query->orderBy('due_date', 'asc'),
            'due_date_desc' => $query->orderBy('due_date', 'desc'),
            default => $query->latest(),
        };

        $perPage = $request->input('per_page', 6);
        return TaskResource::collection($query->paginate($perPage));
    }

    // POST /api/tasks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,completed',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array'
        ]);

        $task = $request->user()->tasks()->create($validated);
        return new TaskResource($task);
    }

    // GET /api/tasks/{task}
    public function show(Task $task)
    {
        return new TaskResource($task);
    }

    // PUT /api/tasks/{task}
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,completed',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array'
        ]);

        $task->update($validated);
        return new TaskResource($task);
    }

    // DELETE /api/tasks/{task}
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully.']);
    }

    // PATCH /api/tasks/{task}/toggle
    public function toggleStatus(Task $task)
    {
        $task->status = $task->status === 'completed' ? 'pending' : 'completed';
        $task->save();
        return new TaskResource($task);
    }
}`;

  const laravelMigrationCode = `// database/migrations/xxxx_xx_xx_create_tasks_table.php
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('description')->nullable();
    $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
    $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
    $table->date('due_date')->nullable();
    $table->json('tags')->nullable();
    $table->timestamps();
});`;

  return (
    <Modal
      id="laravel-guide-modal"
      isOpen={isGuideOpen}
      onClose={() => dispatch(setGuideOpen(false))}
      maxWidth="max-w-3xl"
      title="Laravel Backend Integration & API Bridge"
      subtitle="Configure real Laravel API endpoint or inspect standard Laravel 10/11 backend controllers"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("config")}
            className={`pb-2.5 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "config"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Server className="w-4 h-4" />
            API Connection & Mode
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("routes")}
            className={`pb-2.5 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "routes"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Code2 className="w-4 h-4" />
            routes/api.php
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("controller")}
            className={`pb-2.5 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "controller"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Layers className="w-4 h-4" />
            TaskController.php
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("migration")}
            className={`pb-2.5 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "migration"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Database className="w-4 h-4" />
            Migration Schema
          </button>
        </div>

        {/* Tab 1: Connection & Live Switcher */}
        {activeTab === "config" && (
          <div className="space-y-4 pt-1">
            {/* Mode Switch Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${useMockApi ? "text-amber-500" : "text-emerald-500"}`} />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Active Driver: {useMockApi ? "Built-in Laravel Mock Sandbox" : "Live Laravel Server API"}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                  {useMockApi
                    ? "Operating in local sandbox mode with persistent Laravel-compatible data structures, Sanctum tokens, and 422 validation simulation."
                    : "Connecting directly to your live Laravel server via Axios with Bearer token authentication."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  id="btn-toggle-api-mode"
                  variant={useMockApi ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => {
                    dispatch(toggleApiMode());
                    dispatch(fetchTasks());
                  }}
                >
                  {useMockApi ? "Switch to Live Laravel" : "Switch to Mock Sandbox"}
                </Button>
              </div>
            </div>

            {/* URL configuration & Test */}
            <form onSubmit={handleSaveUrl} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Laravel API Base URL (e.g. <code className="text-indigo-600 font-mono">http://localhost:8000/api</code>)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="input-laravel-base-url"
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="http://localhost:8000/api"
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  />
                  <Button
                    type="submit"
                    id="btn-save-api-url"
                    variant="secondary"
                    size="sm"
                  >
                    Save URL
                  </Button>
                  <Button
                    type="button"
                    id="btn-test-laravel-conn"
                    variant="primary"
                    size="sm"
                    onClick={handleTest}
                    isLoading={testStatus === "testing"}
                    leftIcon={Activity}
                  >
                    Test Ping
                  </Button>
                </div>
              </div>

              {testMessage && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    testStatus === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : testStatus === "error"
                      ? "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                      : "bg-indigo-50 text-indigo-800 border border-indigo-200"
                  }`}
                >
                  {testStatus === "success" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Activity className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{testMessage}</span>
                </div>
              )}
            </form>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  id="btn-view-api-logs"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    dispatch(setGuideOpen(false));
                    dispatch(setApiLogsOpen(true));
                  }}
                  leftIcon={Terminal}
                >
                  View HTTP Request Logs
                </Button>
                <Button
                  type="button"
                  id="btn-reset-demo-db"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetData}
                  leftIcon={RefreshCw}
                >
                  Reset Mock Database
                </Button>
              </div>

              <span className="text-slate-400 text-2xs">
                CORS allowed origins: <code className="text-slate-600 dark:text-slate-300 font-mono">http://localhost:3000</code>
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: routes/api.php Code */}
        {activeTab === "routes" && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={() => handleCopy(laravelRoutesCode, "routes")}
                className="px-2.5 py-1 text-2xs bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-md flex items-center gap-1 transition-colors border border-slate-700 shadow-xs"
              >
                {copiedKey === "routes" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "routes" ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 max-h-[380px] leading-relaxed">
              <code>{laravelRoutesCode}</code>
            </pre>
          </div>
        )}

        {/* Tab 3: TaskController.php Code */}
        {activeTab === "controller" && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={() => handleCopy(laravelControllerCode, "controller")}
                className="px-2.5 py-1 text-2xs bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-md flex items-center gap-1 transition-colors border border-slate-700 shadow-xs"
              >
                {copiedKey === "controller" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "controller" ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 max-h-[380px] leading-relaxed">
              <code>{laravelControllerCode}</code>
            </pre>
          </div>
        )}

        {/* Tab 4: Migration Code */}
        {activeTab === "migration" && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={() => handleCopy(laravelMigrationCode, "migration")}
                className="px-2.5 py-1 text-2xs bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-md flex items-center gap-1 transition-colors border border-slate-700 shadow-xs"
              >
                {copiedKey === "migration" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "migration" ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 max-h-[380px] leading-relaxed">
              <code>{laravelMigrationCode}</code>
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LaravelGuideDrawer;
