// file: app/(pos)/layout.tsx
import React from "react";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  // Layout này sẽ không có Sidebar hay Header của trang admin
  return <main className="h-screen w-screen bg-slate-50">{children}</main>;
}
