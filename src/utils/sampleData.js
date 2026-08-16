// Initial seed data representing Laravel Database Seeder
export const initialTasks = [
  {
    id: 1,
    title: "Implement Laravel Sanctum Authentication",
    description: "Set up API tokens, guard configuration in config/auth.php, and create AuthController with login, register, and logout methods.",
    status: "completed",
    priority: "high",
    due_date: "2026-08-20",
    tags: ["Backend", "Laravel", "Auth"],
    created_at: "2026-08-10T09:00:00.000000Z",
    updated_at: "2026-08-12T14:30:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  },
  {
    id: 2,
    title: "Create Task Resource & Paginated Controller",
    description: "Build TaskController index method utilizing Task::paginate(10) and TaskResource to output standard Laravel pagination metadata.",
    status: "in_progress",
    priority: "high",
    due_date: "2026-08-22",
    tags: ["Laravel", "API", "Database"],
    created_at: "2026-08-11T11:15:00.000000Z",
    updated_at: "2026-08-14T16:45:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  },
  {
    id: 3,
    title: "Build Redux Toolkit Slice & Async Thunks",
    description: "Connect React frontend to Laravel endpoints using createAsyncThunk for CRUD actions and state management.",
    status: "in_progress",
    priority: "medium",
    due_date: "2026-08-24",
    tags: ["React", "Redux", "Frontend"],
    created_at: "2026-08-12T13:20:00.000000Z",
    updated_at: "2026-08-15T10:00:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  },
  {
    id: 4,
    title: "Design Responsive Task Card & View Modal",
    description: "Create accessible task view component showing tags, priority indicators, full description, and quick status toggle.",
    status: "completed",
    priority: "medium",
    due_date: "2026-08-25",
    tags: ["UI/UX", "Tailwind", "Components"],
    created_at: "2026-08-13T08:30:00.000000Z",
    updated_at: "2026-08-15T12:00:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  },
  {
    id: 5,
    title: "Configure CORS Middleware in Laravel Kernel",
    description: "Ensure config/cors.php has proper allowed_origins (e.g., localhost:3000) and supports Authorization headers for Bearer tokens.",
    status: "pending",
    priority: "high",
    due_date: "2026-08-28",
    tags: ["Security", "Laravel", "Config"],
    created_at: "2026-08-14T15:10:00.000000Z",
    updated_at: "2026-08-14T15:10:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  },
  {
    id: 6,
    title: "Write Form Request Validation Rules",
    description: "Create StoreTaskRequest and UpdateTaskRequest with required fields, title max:255, and valid priority/status enum values.",
    status: "pending",
    priority: "low",
    due_date: "2026-08-30",
    tags: ["Validation", "Laravel"],
    created_at: "2026-08-14T17:00:00.000000Z",
    updated_at: "2026-08-14T17:00:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  },
  {
    id: 7,
    title: "Implement Task Search & Multi-Filter Query Scope",
    description: "Add Eloquent query scopes for scopeFilter($query, $filters) to seamlessly handle search keyword, status, and priority parameters.",
    status: "completed",
    priority: "medium",
    due_date: "2026-09-01",
    tags: ["Eloquent", "QueryBuilder", "Backend"],
    created_at: "2026-08-15T09:40:00.000000Z",
    updated_at: "2026-08-15T14:10:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  },
  {
    id: 8,
    title: "Setup Automated Unit Tests for API Endpoints",
    description: "Write PHPUnit feature tests asserting JSON structure for /api/tasks index, show, store, update, and destroy actions.",
    status: "pending",
    priority: "low",
    due_date: "2026-09-05",
    tags: ["Testing", "PHPUnit", "CI/CD"],
    created_at: "2026-08-15T11:00:00.000000Z",
    updated_at: "2026-08-15T11:00:00.000000Z",
    user_id: 1,
    author: "Alex Morgan"
  }
];

export const initialUsers = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "password123",
    email_verified_at: "2026-08-01T00:00:00.000000Z",
    created_at: "2026-08-01T00:00:00.000000Z"
  }
];
