// file: app/(main)/categories/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaLamViecResponse } from "@/types/api";

interface ShiftsColumnsProps {
  onEdit: (data: CaLamViecResponse) => void;
  onDelete: (data: CaLamViecResponse) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: ShiftsColumnsProps): ColumnDef<CaLamViecResponse>[] => [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🏷️ ID
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm font-semibold text-orange-700 dark:text-orange-400">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "tenCa",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        ⏰ Tên Ca
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-red-700 dark:text-red-400">
        {row.getValue("tenCa")}
      </div>
    ),
  },
  {
    accessorKey: "gioBatDau",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🌅 Giờ Bắt Đầu
      </div>
    ),
    cell: ({ row }) => {
      const time = row.getValue("gioBatDau") as string;
      const hour = parseInt(time.split(":")[0]);
      const timeIcon = hour < 12 ? "🌅" : hour < 18 ? "☀️" : "🌙";

      return (
        <div className="font-mono text-blue-600 dark:text-blue-400 font-medium">
          {timeIcon} {time}
        </div>
      );
    },
  },
  {
    accessorKey: "gioKetThuc",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🌇 Giờ Kết Thúc
      </div>
    ),
    cell: ({ row }) => {
      const time = row.getValue("gioKetThuc") as string;
      const hour = parseInt(time.split(":")[0]);
      const timeIcon = hour < 12 ? "🌅" : hour < 18 ? "☀️" : "🌙";

      return (
        <div className="font-mono text-amber-600 dark:text-amber-400 font-medium">
          {timeIcon} {time}
        </div>
      );
    },
  },
  {
    id: "duration",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        ⏱️ Thời lượng
      </div>
    ),
    cell: ({ row }) => {
      const start = row.original.gioBatDau;
      const end = row.original.gioKetThuc;

      const startMinutes =
        parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
      let endMinutes =
        parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);

      // Handle overnight shifts
      if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60; // Add 24 hours
      }

      const durationMinutes = endMinutes - startMinutes;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      return (
        <div className="text-purple-600 dark:text-purple-400 font-medium">
          ⏱️ {hours}h {minutes > 0 ? `${minutes}m` : ""}
        </div>
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
      const shift = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/20"
            >
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(shift)} className="gap-2">
              ✏️ Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(shift)}
            >
              🗑️ Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
