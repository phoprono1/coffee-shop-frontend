// file: app/(main)/orders/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DonHangResponse } from "@/types/api";
import { format } from "date-fns";
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
import { TrangThaiDonHang, TrangThaiDonHangLabels } from "@/constants/enums";

interface OrdersColumnsProps {
  onViewDetail: (data: DonHangResponse) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const getColumns = ({
  onViewDetail,
}: OrdersColumnsProps): ColumnDef<DonHangResponse>[] => [
  { accessorKey: "id", header: "Mã Đơn" },
  {
    accessorKey: "ban",
    header: "Bàn",
    cell: ({ row }) =>
      row.original.ban ? (
        row.original.ban.soBan
      ) : (
        <Badge variant="secondary">Mang đi</Badge>
      ),
  },
  {
    accessorFn: (row) => row.nhanVienTao.ten,
    header: "Nhân viên",
  },
  {
    accessorKey: "thoiGianTao",
    header: "Thời gian tạo",
    cell: ({ row }) =>
      format(new Date(row.getValue("thoiGianTao")), "dd/MM/yyyy HH:mm"),
  },
  {
    accessorKey: "tongTienThanhToan",
    header: "Tổng tiền",
    cell: ({ row }) => formatCurrency(row.getValue("tongTienThanhToan")),
  },
  {
    accessorKey: "trangThaiDonHang",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("trangThaiDonHang") as TrangThaiDonHang;

      // Lấy label từ đối tượng ánh xạ
      const label = TrangThaiDonHangLabels[status] || status;

      // Dùng enum để so sánh, an toàn hơn nhiều
      if (status === TrangThaiDonHang.HUY) {
        return <Badge variant="destructive">{label}</Badge>;
      }
      if (
        status === TrangThaiDonHang.DA_THANH_TOAN ||
        status === TrangThaiDonHang.HOAN_THANH
      ) {
        return (
          <Badge className="bg-green-500 hover:bg-green-600">{label}</Badge>
        );
      }
      return <Badge>{label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetail(order)}>
              Xem chi tiết
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
