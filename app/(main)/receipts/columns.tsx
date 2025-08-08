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
  { accessorKey: "id", header: "Mã Phiếu" },
  { accessorFn: (row) => row.nhaCungCap.tenNhaCungCap, header: "Nhà Cung Cấp" },
  { accessorFn: (row) => row.nhanVienNhap.ten, header: "Nhân viên nhập" },
  {
    accessorKey: "ngayNhap",
    header: "Ngày Nhập",
    cell: ({ row }) => format(new Date(row.getValue("ngayNhap")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "tongTienNhap",
    header: "Tổng Tiền",
    cell: ({ row }) => formatCurrency(row.getValue("tongTienNhap")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const receipt = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onDetail(receipt)}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(receipt)}
            >
              Xóa Phiếu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
