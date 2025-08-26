// file: app/(main)/categories/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DanhMucResponse } from "@/types/api";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoriesColumnsProps {
  onEdit: (data: DanhMucResponse) => void;
  onDelete: (data: DanhMucResponse) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: CategoriesColumnsProps): ColumnDef<DanhMucResponse>[] => [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🏷️ ID
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "tenDanhMuc",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📂 Tên Danh Mục
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-green-700 dark:text-green-400">
        {row.getValue("tenDanhMuc")}
      </div>
    ),
  },
  {
    accessorKey: "moTa",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📝 Mô tả
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
        {row.getValue("moTa") || "Không có mô tả"}
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
      const category = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
            >
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onEdit(category)}
              className="gap-2"
            >
              ✏️ Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(category)}
            >
              🗑️ Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
