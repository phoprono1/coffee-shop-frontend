// file: app/(main)/inventory/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NguyenVatLieuResponse } from "@/types/api";
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

interface InventoryColumnsProps {
  onEdit: (data: NguyenVatLieuResponse) => void;
  onDelete: (data: NguyenVatLieuResponse) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: InventoryColumnsProps): ColumnDef<NguyenVatLieuResponse>[] => [
  {
    accessorKey: "tenNguyenLieu",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📦 Tên Nguyên Vật Liệu
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-blue-700 dark:text-blue-400">
        {row.getValue("tenNguyenLieu")}
      </div>
    ),
  },
  {
    accessorKey: "donViTinh",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📏 Đơn vị tính
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        {row.getValue("donViTinh")}
      </Badge>
    ),
  },
  {
    accessorKey: "soLuongTonHienTai",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        📊 Tồn kho
      </div>
    ),
    cell: ({ row }) => {
      const soLuong: number = row.getValue("soLuongTonHienTai");
      const mucCanhBao: number = row.original.mucCanhBaoTonKho;
      const isLowStock = soLuong <= mucCanhBao;
      const isOutOfStock = soLuong === 0;

      return (
        <div
          className={`font-bold ${
            isOutOfStock
              ? "text-red-600 dark:text-red-400"
              : isLowStock
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
          }`}
        >
          {isOutOfStock ? "⚠️" : isLowStock ? "⚡" : "✅"} {soLuong}
        </div>
      );
    },
  },
  {
    accessorKey: "mucCanhBaoTonKho",
    header: () => (
      <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
        🚨 Mức cảnh báo
      </div>
    ),
    cell: ({ row }) => {
      const soLuongTon: number = row.getValue("soLuongTonHienTai");
      const mucCanhBao: number = row.getValue("mucCanhBaoTonKho");
      const isLowStock = soLuongTon <= mucCanhBao;

      return isLowStock ? (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800">
          🔴 {mucCanhBao}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
          {mucCanhBao}
        </Badge>
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
      const material = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="font-medium">
              🛠️ Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onEdit(material)}
              className="gap-2"
            >
              ✏️ Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 gap-2"
              onClick={() => onDelete(material)}
            >
              🗑️ Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
