// file: app/(main)/layout.tsx

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar cho Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:pl-64 min-h-screen">
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Content Wrapper with proper spacing */}
          <div className="container mx-auto p-6 space-y-6 max-w-7xl">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[calc(100vh-200px)]">
              <div className="p-6">{children}</div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <p>&copy; 2024 Coffee Shop Management. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-4">
                <span>Version 1.0.0</span>
                <span>•</span>
                <span>Support: support@coffeeshop.com</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
