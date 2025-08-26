// file: app/(main)/suppliers/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NhaCungCapResponse } from "@/types/api";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SuppliersColumnsProps {
  onEdit: (data: NhaCungCapResponse) => void;
  onDelete: (data: NhaCungCapResponse) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: SuppliersColumnsProps): ColumnDef<NhaCungCapResponse>[] => [
  {
    accessorKey: "tenNhaCungCap",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🏢 Tên Nhà Cung Cấp
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-purple-700 dark:text-purple-400">
        {row.getValue("tenNhaCungCap")}
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
      <div className="text-blue-600 dark:text-blue-400 font-mono text-sm">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "soDienThoai",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📞 Số điện thoại
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-green-600 dark:text-green-400 font-mono">
        {row.getValue("soDienThoai")}
      </div>
    ),
  },
  {
    accessorKey: "diaChi",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📍 Địa chỉ
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
        {row.getValue("diaChi")}
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
      const supplier = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onEdit(supplier)}
              className="gap-2"
            >
              ✏️ Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(supplier)}
            >
              🗑️ Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
