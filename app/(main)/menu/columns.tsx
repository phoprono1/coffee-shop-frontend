// file: app/(main)/menu/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ThucDonResponse } from "@/types/api"; // Lát nữa chúng ta sẽ cập nhật file này
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Props mới cho hàm getColumns
interface MenuColumnsProps {
  onEdit: (menuItem: ThucDonResponse) => void;
  onDelete: (menuItem: ThucDonResponse) => void;
  onManageRecipe: (menuItem: ThucDonResponse) => void;
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
  onManageRecipe,
}: MenuColumnsProps): ColumnDef<ThucDonResponse>[] => [
  {
    accessorKey: "tenMon",
    header: "Tên món",
  },
  {
    accessorKey: "loaiMon",
    header: "Loại món",
  },
  {
    accessorKey: "gia",
    header: () => <div className="text-right">Giá</div>,
    cell: ({ row }) => {
      const gia = parseFloat(row.getValue("gia"));
      return (
        <div className="text-right font-medium">{formatCurrency(gia)}</div>
      );
    },
  },
  {
    accessorKey: "khaDung",
    header: "Trạng thái",
    cell: ({ row }) => {
      const khaDung: boolean = row.getValue("khaDung");
      return khaDung ? (
        <Badge variant="default">Khả dụng</Badge>
      ) : (
        <Badge variant="destructive">Hết hàng</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const mon = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(mon.id.toString())}
            >
              Sao chép ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(mon)}>
              Sửa món
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageRecipe(mon)}>
              Quản lý công thức
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(mon)}
            >
              Xóa món
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
