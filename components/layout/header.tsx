// file: components/layout/header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Menu, Coffee, Search, Bell, Settings } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { UserButton } from "../auth/user-button";
import { TimekeepingModal } from "../modals/timekeeping-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";

export const Header = () => {
  const pathname = usePathname();
  const [isTimekeepingModalOpen, setIsTimekeepingModalOpen] = useState(false);

  // Get current page info
  const currentPage = navLinks.find((link) => link.href === pathname);
  const pageTitle = currentPage?.label || "Dashboard";

  return (
    <>
      <TimekeepingModal
        isOpen={isTimekeepingModalOpen}
        onClose={() => setIsTimekeepingModalOpen(false)}
      />
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          {/* Mobile Menu */}
          <nav className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col w-64 p-0">
                <SheetHeader className="p-6 border-b bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <SheetTitle className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Coffee className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span className="font-heading text-lg">Coffee Shop</span>
                      <p className="text-xs opacity-90 font-normal">
                        Management System
                      </p>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Danh sách các chức năng chính của hệ thống quản lý quán cà
                    phê.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <div
                          className={cn(
                            "p-1.5 rounded-md",
                            isActive
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                              : "text-slate-400"
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                        </div>
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </nav>

          {/* Page Title & Breadcrumb */}
          <div className="flex items-center gap-2 flex-1">
            <div className="hidden md:flex items-center gap-2">
              {currentPage && (
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <currentPage.icon className="h-4 w-4" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {pageTitle}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quản lý thông tin {pageTitle.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:inline-flex"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                3
              </Badge>
              <span className="sr-only">Thông báo</span>
            </Button>

            {/* Settings */}
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Cài đặt</span>
            </Button>

            {/* Timekeeping */}
            <Button
              variant="outline"
              onClick={() => setIsTimekeepingModalOpen(true)}
              className="hidden sm:inline-flex bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/30"
            >
              <Clock className="mr-2 h-4 w-4" />
              Chấm công
            </Button>

            {/* Mobile Timekeeping Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsTimekeepingModalOpen(true)}
              className="sm:hidden bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
            >
              <Clock className="h-4 w-4" />
              <span className="sr-only">Chấm công</span>
            </Button>

            {/* User Profile */}
            <UserButton />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden px-4 pb-4 border-t border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </header>
    </>
  );
};
