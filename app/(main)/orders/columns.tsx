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

const getStatusIcon = (status: TrangThaiDonHang) => {
  switch (status) {
    case TrangThaiDonHang.DANG_CHO:
      return "⏳";
    case TrangThaiDonHang.DANG_PHA_CHE:
      return "☕";
    case TrangThaiDonHang.DA_SAN_SANG:
      return "✅";
    case TrangThaiDonHang.DA_PHUC_VU:
      return "🍽️";
    case TrangThaiDonHang.DA_THANH_TOAN:
      return "💳";
    case TrangThaiDonHang.HOAN_THANH:
      return "🎉";
    case TrangThaiDonHang.HUY:
      return "❌";
    default:
      return "📋";
  }
};

const getStatusColor = (status: TrangThaiDonHang) => {
  switch (status) {
    case TrangThaiDonHang.HOAN_THANH:
    case TrangThaiDonHang.DA_THANH_TOAN:
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case TrangThaiDonHang.HUY:
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case TrangThaiDonHang.DANG_PHA_CHE:
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    case TrangThaiDonHang.DA_SAN_SANG:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case TrangThaiDonHang.DA_PHUC_VU:
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
};

export const getColumns = ({
  onViewDetail,
}: OrdersColumnsProps): ColumnDef<DonHangResponse>[] => [
  {
    accessorKey: "id",
    header: "🆔 Mã đơn",
    cell: ({ row }) => (
      <div className="font-mono font-medium text-blue-600 dark:text-blue-400">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "ban",
    header: "🪑 Bàn",
    cell: ({ row }) => {
      const ban = row.original.ban;
      return ban ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">🪑</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Bàn {ban.soBan}
          </span>
        </div>
      ) : (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
          <span className="mr-1">🥤</span>
          Mang đi
        </Badge>
      );
    },
  },
  {
    accessorFn: (row) => row.nhanVienTao.ten,
    header: "👤 Nhân viên",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 dark:text-gray-100">
        {row.original.nhanVienTao.ten}
      </div>
    ),
  },
  {
    accessorKey: "thoiGianTao",
    header: "📅 Thời gian tạo",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {format(new Date(row.getValue("thoiGianTao")), "dd/MM/yyyy HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "tongTienThanhToan",
    header: "💰 Tổng tiền",
    cell: ({ row }) => (
      <div className="font-bold text-green-600 dark:text-green-400">
        {formatCurrency(row.getValue("tongTienThanhToan"))}
      </div>
    ),
  },
  {
    accessorKey: "trangThaiDonHang",
    header: "📊 Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("trangThaiDonHang") as TrangThaiDonHang;
      const label = TrangThaiDonHangLabels[status] || status;

      return (
        <Badge className={`border ${getStatusColor(status)}`}>
          <span className="mr-1">{getStatusIcon(status)}</span>
          {label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "⚙️ Thao tác",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onViewDetail(order)}
              className="cursor-pointer"
            >
              <span className="mr-2">👁️</span>
              Xem chi tiết
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
