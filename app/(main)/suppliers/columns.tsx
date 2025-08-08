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
  { accessorKey: "tenNhaCungCap", header: "Tên Nhà Cung Cấp" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "soDienThoai", header: "Số điện thoại" },
  { accessorKey: "diaChi", header: "Địa chỉ" },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(supplier)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(supplier)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
