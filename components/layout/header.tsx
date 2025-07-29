// file: components/layout/header.tsx (Đã sửa lỗi)

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Utensils } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription, // Import thêm
  SheetHeader,      // Import thêm
  SheetTitle,       // Import thêm
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { UserButton } from "../auth/user-button";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white dark:bg-slate-950 px-4 md:px-6 sticky top-0 z-40">
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            {/* Thêm SheetHeader để chứa Title và Description */}
            <SheetHeader>
              <SheetTitle className="sr-only">Menu chính</SheetTitle>
              <SheetDescription className="sr-only">
                Danh sách các chức năng chính của hệ thống.
              </SheetDescription>
            </SheetHeader>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold text-lg mb-4 border-b pb-4"
            >
              <Utensils className="h-6 w-6" />
              <span>Coffee Admin</span>
            </Link>
            <div className="flex flex-col gap-1">
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
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <div className="w-full flex justify-end">
        <UserButton />
      </div>
    </header>
  );
};