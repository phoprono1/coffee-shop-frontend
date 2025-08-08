// file: app/(main)/promotions/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { KhuyenMaiResponse } from "@/types/api";
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
import { format } from "date-fns";

interface PromotionsColumnsProps {
  onEdit: (data: KhuyenMaiResponse) => void;
  onDelete: (data: KhuyenMaiResponse) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const getColumns = ({
  onEdit,
  onDelete,
}: PromotionsColumnsProps): ColumnDef<KhuyenMaiResponse>[] => [
  { accessorKey: "tenKhuyenMai", header: "Tên Khuyến Mãi" },
  {
    header: "Giảm giá",
    cell: ({ row }) => {
      const promotion = row.original;
      if (promotion.phanTramGiamGia > 0) {
        return `${promotion.phanTramGiamGia}%`;
      }
      if (promotion.giaTriGiamGiaCoDinh > 0) {
        return formatCurrency(promotion.giaTriGiamGiaCoDinh);
      }
      return "N/A";
    },
  },
  {
    accessorKey: "ngayBatDau",
    header: "Ngày Bắt Đầu",
    cell: ({ row }) =>
      format(new Date(row.getValue("ngayBatDau")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "ngayKetThuc",
    header: "Ngày Kết Thúc",
    cell: ({ row }) =>
      format(new Date(row.getValue("ngayKetThuc")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "trangThaiKichHoat",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("trangThaiKichHoat");
      return isActive ? (
        <Badge variant="default">Đang hoạt động</Badge>
      ) : (
        <Badge variant="secondary">Không hoạt động</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const promotion = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(promotion)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(promotion)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
