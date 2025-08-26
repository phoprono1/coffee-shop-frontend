"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Coffee, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Sidebar = () => {
  const pathname = usePathname();

  // Nhóm menu theo category
  const menuGroups = [
    {
      title: "Vận hành",
      items: navLinks.slice(0, 3), // POS, Table Map, Orders
      color: "bg-emerald-500",
    },
    {
      title: "Quản lý & Báo cáo",
      items: navLinks.slice(3, 4), // Dashboard
      color: "bg-blue-500",
    },
    {
      title: "Sản phẩm & Kho",
      items: navLinks.slice(4, 9), // Menu, Categories, Inventory, Receipts, Suppliers
      color: "bg-amber-500",
    },
    {
      title: "Kinh doanh",
      items: navLinks.slice(9, 11), // Promotions, Tables
      color: "bg-purple-500",
    },
    {
      title: "Nhân sự",
      items: navLinks.slice(11), // Schedules, My Schedule, Timekeeping, Employees, Shifts
      color: "bg-rose-500",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 font-bold text-xl group transition-transform hover:scale-105"
        >
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Coffee className="h-6 w-6" />
          </div>
          <div>
            <span className="font-heading">Coffee Shop</span>
            <p className="text-xs opacity-90 font-normal">Management System</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className={cn("w-2 h-2 rounded-full", group.color)} />
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {group.title}
              </h3>
            </div>

            <div className="space-y-1">
              {group.items.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50",
                      isActive
                        ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isActive
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                    </div>

                    <span className="flex-1 truncate">{link.label}</span>

                    {isActive && (
                      <ChevronRight className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                    )}

                    {/* Badge for special items */}
                    {link.href === "/pos" && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        Live
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
            <Coffee className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-900 dark:text-white">
              Quản lý quán cà phê
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Version 1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
