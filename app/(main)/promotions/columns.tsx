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
import { format, isPast } from "date-fns";

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
  {
    accessorKey: "tenKhuyenMai",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🎫 Tên Khuyến Mãi
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-pink-700 dark:text-pink-400">
        {row.getValue("tenKhuyenMai")}
      </div>
    ),
  },
  {
    id: "giamGia",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        💸 Giảm giá
      </div>
    ),
    cell: ({ row }) => {
      const promotion = row.original;
      if (promotion.phanTramGiamGia > 0) {
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800 font-bold">
            🔥 {promotion.phanTramGiamGia}%
          </Badge>
        );
      }
      if (promotion.giaTriGiamGiaCoDinh > 0) {
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800">
            💰 {formatCurrency(promotion.giaTriGiamGiaCoDinh)}
          </Badge>
        );
      }
      return <span className="text-gray-500">N/A</span>;
    },
  },
  {
    accessorKey: "ngayBatDau",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📅 Ngày Bắt Đầu
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-blue-600 dark:text-blue-400 font-medium">
        {format(new Date(row.getValue("ngayBatDau")), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "ngayKetThuc",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        ⏰ Ngày Kết Thúc
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-amber-600 dark:text-amber-400 font-medium">
        {format(new Date(row.getValue("ngayKetThuc")), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "trangThaiKichHoat",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📊 Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const promotion = row.original;
      const isActiveInDb = promotion.trangThaiKichHoat;
      const endDate = new Date(promotion.ngayKetThuc);
      const now = new Date();
      const startDate = new Date(promotion.ngayBatDau);

      // Xác định trạng thái hiện tại
      const isEffectivelyActive =
        isActiveInDb && now >= startDate && now <= endDate;
      const isUpcoming = isActiveInDb && now < startDate;
      const isExpired = isPast(endDate);

      if (isEffectivelyActive) {
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800">
            ✅ Đang hoạt động
          </Badge>
        );
      } else if (isUpcoming) {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
            ⏰ Sắp diễn ra
          </Badge>
        );
      } else if (isExpired) {
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 border-gray-200 dark:border-gray-800">
            ⏹️ Hết hạn
          </Badge>
        );
      } else {
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800">
            ❌ Tạm dừng
          </Badge>
        );
      }
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
      const promotion = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-pink-100 dark:hover:bg-pink-900/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onEdit(promotion)}
              className="gap-2"
            >
              ✏️ Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(promotion)}
            >
              🗑️ Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
