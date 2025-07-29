// file: app/(main)/layout.tsx

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Sidebar cho Desktop */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 md:pl-56">
        <Header />
        <main className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;