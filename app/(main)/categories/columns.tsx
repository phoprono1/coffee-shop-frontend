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
    header: "ID",
  },
  {
    accessorKey: "tenDanhMuc",
    header: "Tên Danh Mục",
  },
  {
    accessorKey: "moTa",
    header: "Mô tả",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(category)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
