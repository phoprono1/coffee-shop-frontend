// file: app/(main)/tables/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BanResponse } from "@/types/api";
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

interface TablesColumnsProps {
  onEdit: (data: BanResponse) => void;
  onDelete: (data: BanResponse) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: TablesColumnsProps): ColumnDef<BanResponse>[] => [
  { accessorKey: "soBan", header: "Số Bàn" },
  { accessorKey: "viTri", header: "Vị trí" },
  { accessorKey: "sucChua", header: "Sức chứa" },
  {
    accessorKey: "trangThaiBan",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("trangThaiBan") as string;
      if (status === "CO_KHACH") {
        return <Badge variant="destructive">Có khách</Badge>;
      }
      if (status === "DA_DAT_TRUOC") {
        return <Badge variant="secondary">Đã đặt</Badge>;
      }
      return <Badge>Trống</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const table = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(table)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(table)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
