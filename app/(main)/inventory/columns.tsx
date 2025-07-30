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
  { accessorKey: "tenNguyenLieu", header: "Tên Nguyên Vật Liệu" },
  { accessorKey: "donViTinh", header: "Đơn vị tính" },
  { accessorKey: "soLuongTonHienTai", header: "Tồn kho" },
  {
    accessorKey: "mucCanhBaoTonKho",
    header: "Mức cảnh báo",
    cell: ({ row }) => {
      const soLuongTon: number = row.getValue("soLuongTonHienTai");
      const mucCanhBao: number = row.getValue("mucCanhBaoTonKho");
      const isLowStock = soLuongTon <= mucCanhBao;
      return isLowStock ? (
        <Badge variant="destructive">{mucCanhBao}</Badge>
      ) : (
        <span>{mucCanhBao}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const material = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(material)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(material)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
