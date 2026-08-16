import React, { useState } from "react";
import Navbar from "./components/common/Navbar";
import TasksDashboardPage from "./features/tasks/pages/TasksDashboardPage";
import AuthModal from "./features/auth/components/AuthModal";
import LaravelGuideDrawer from "./features/apiConfig/components/LaravelGuideDrawer";
import ApiLogsModal from "./features/apiConfig/components/ApiLogsModal";
import ToastContainer from "./components/common/ToastContainer";

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenCreateTask={() => setIsCreateModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Application Content */}
      <main className="flex-1">
        <TasksDashboardPage
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      </main>

      {/* Auth Dialog (Laravel Sanctum Sign In & Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Laravel Documentation & Live API Bridge Drawer */}
      <LaravelGuideDrawer />

      {/* Real-time HTTP Telemetry Logs Modal */}
      <ApiLogsModal />

      {/* Notification Toast System */}
      <ToastContainer />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Laravel API Task Application • React & Redux Toolkit Architecture
          </p>
          <div className="flex items-center gap-4 text-2xs">
            <span>GET /api/tasks (Paginated)</span>
            <span>•</span>
            <span>POST /api/tasks</span>
            <span>•</span>
            <span>PUT /api/tasks/:id</span>
            <span>•</span>
            <span>DELETE /api/tasks/:id</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
