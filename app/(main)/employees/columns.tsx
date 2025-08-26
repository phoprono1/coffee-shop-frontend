// file: app/(main)/employees/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NhanVienResponse } from "@/types/api";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface EmployeesColumnsProps {
  onEdit: (data: NhanVienResponse) => void;
  onDelete: (data: NhanVienResponse) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const getColumns = ({
  onEdit,
  onDelete,
}: EmployeesColumnsProps): ColumnDef<NhanVienResponse>[] => [
  {
    accessorKey: "ten",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        👤 Tên Nhân Viên
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-blue-700 dark:text-blue-400">
        {row.getValue("ten")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📧 Email
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "sdt",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📞 Số điện thoại
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-green-600 dark:text-green-400 font-mono">
        {row.getValue("sdt")}
      </div>
    ),
  },
  {
    accessorKey: "chucVu",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        💼 Chức vụ
      </div>
    ),
    cell: ({ row }) => {
      const chucVu = row.getValue("chucVu") as string;
      const badgeClass =
        chucVu === "QUAN_LY"
          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800"
          : chucVu === "NHAN_VIEN_BAN_HANG"
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800";

      const displayText =
        chucVu === "QUAN_LY"
          ? "👔 Quản lý"
          : chucVu === "NHAN_VIEN_BAN_HANG"
            ? "🛍️ NV Bán hàng"
            : "👥 Nhân viên";

      return (
        <div
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badgeClass}`}
        >
          {displayText}
        </div>
      );
    },
  },
  {
    accessorKey: "ngayVaoLam",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📅 Ngày vào làm
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-amber-600 dark:text-amber-400 font-medium">
        {format(new Date(row.getValue("ngayVaoLam")), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "luongCoBan",
    header: () => (
      <div className="text-right font-medium text-gray-900 dark:text-gray-100">
        💰 Lương Cơ Bản
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-bold text-green-600 dark:text-green-400">
        {formatCurrency(row.getValue("luongCoBan"))}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-medium text-gray-900 dark:text-gray-100">
        ⚙️ Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onEdit(employee)}
              className="gap-2"
            >
              ✏️ Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(employee)}
            >
              🗑️ Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
