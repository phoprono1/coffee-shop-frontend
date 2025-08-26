// file: app/(main)/tables/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BanResponse } from "@/types/api";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TablesColumnsProps {
  onEdit: (data: BanResponse) => void;
  onDelete: (data: BanResponse) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: TablesColumnsProps): ColumnDef<BanResponse>[] => [
  {
    accessorKey: "soBan",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🪑 Số Bàn
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-bold text-indigo-700 dark:text-indigo-400 text-lg">
        #{row.getValue("soBan")}
      </div>
    ),
  },
  {
    accessorKey: "viTri",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📍 Vị trí
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-gray-700 dark:text-gray-300">
        {row.getValue("viTri")}
      </div>
    ),
  },
  {
    accessorKey: "sucChua",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        👥 Sức chứa
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      >
        {row.getValue("sucChua")} người
      </Badge>
    ),
  },
  {
    accessorKey: "trangThaiBan",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📊 Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("trangThaiBan") as string;
      if (status === "CO_KHACH") {
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800">
            🔴 Có khách
          </Badge>
        );
      }
      if (status === "CAN_DON") {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
            🧹 Cần dọn
          </Badge>
        );
      }
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800">
          ✅ Trống
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-medium text-gray-900 dark:text-gray-100">
        ⚙️ Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const table = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(table)} className="gap-2">
              ✏️ Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(table)}
            >
              🗑️ Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
