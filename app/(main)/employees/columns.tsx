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
  { accessorKey: "ten", header: "Tên Nhân Viên" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "sdt", header: "Số điện thoại" },
  { accessorKey: "chucVu", header: "Chức vụ" },
  {
    accessorKey: "ngayVaoLam",
    header: "Ngày vào làm",
    cell: ({ row }) =>
      format(new Date(row.getValue("ngayVaoLam")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "luongCoBan",
    header: "Lương Cơ Bản",
    cell: ({ row }) => formatCurrency(row.getValue("luongCoBan")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(employee)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(employee)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
