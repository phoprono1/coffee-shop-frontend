"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Utensils } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    // 'hidden md:flex' -> Ẩn trên mobile, hiện trên desktop
    <aside className="hidden md:flex flex-col w-56 fixed inset-y-0 z-50 bg-slate-100/50 dark:bg-slate-900/50 border-r">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Utensils className="h-6 w-6" />
          <span>Coffee Admin</span>
        </Link>
      </div>
      <nav className="flex flex-col p-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-slate-900 dark:text-slate-50 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800",
                isActive && "bg-slate-200 dark:bg-slate-800 font-semibold"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};