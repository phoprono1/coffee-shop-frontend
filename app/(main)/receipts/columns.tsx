// file: app/(main)/receipts/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PhieuNhapKhoResponse } from "@/types/api";
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

interface ReceiptsColumnsProps {
  onDelete: (data: PhieuNhapKhoResponse) => void;
  onDetail: (data: PhieuNhapKhoResponse) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const getColumns = ({
  onDelete,
  onDetail,
}: ReceiptsColumnsProps): ColumnDef<PhieuNhapKhoResponse>[] => [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🏷️ Mã Phiếu
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm font-semibold text-green-700 dark:text-green-400">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    id: "nhaCungCap",
    accessorFn: (row) => row.nhaCungCap.tenNhaCungCap,
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🏢 Nhà Cung Cấp
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-blue-700 dark:text-blue-400">
        {row.original.nhaCungCap.tenNhaCungCap}
      </div>
    ),
  },
  {
    id: "nhanVienNhap",
    accessorFn: (row) => row.nhanVienNhap.ten,
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        👤 Nhân viên nhập
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-gray-700 dark:text-gray-300">
        {row.original.nhanVienNhap.ten}
      </div>
    ),
  },
  {
    accessorKey: "ngayNhap",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📅 Ngày Nhập
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-amber-600 dark:text-amber-400 font-medium">
        📊 {format(new Date(row.getValue("ngayNhap")), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "tongTienNhap",
    header: () => (
      <div className="text-right font-medium text-gray-900 dark:text-gray-100">
        💰 Tổng Tiền
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-bold text-green-600 dark:text-green-400">
        {formatCurrency(row.getValue("tongTienNhap"))}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-medium text-gray-900 dark:text-gray-100">
        ⚙️ Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const receipt = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onDetail(receipt)}
              className="gap-2"
            >
              👁️ Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(receipt)}
            >
              🗑️ Xóa Phiếu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
