// file: app/(main)/timekeeping/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChamCongResponse } from "@/types/api";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const formatTime = (timeStr: string | null) => {
  if (!timeStr) return "N/A";
  return format(new Date(timeStr), "HH:mm");
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DUNG_GIO":
      return "✅";
    case "TRE":
      return "⏰";
    case "SOM":
      return "🚀";
    case "VANG_LAM":
      return "❌";
    default:
      return "📝";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "DUNG_GIO":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case "TRE":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    case "SOM":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "VANG_LAM":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "DUNG_GIO":
      return "Đúng giờ";
    case "TRE":
      return "Trễ";
    case "SOM":
      return "Sớm";
    case "VANG_LAM":
      return "Vắng làm";
    default:
      return status;
  }
};

const getShiftIcon = (shiftName: string) => {
  const name = shiftName.toLowerCase();
  if (name.includes("sáng") || name.includes("morning")) return "🌅";
  if (name.includes("chiều") || name.includes("afternoon")) return "🌞";
  if (name.includes("tối") || name.includes("evening")) return "🌙";
  return "⏰";
};

export const columns: ColumnDef<ChamCongResponse>[] = [
  {
    accessorFn: (row) => row.nhanVien.ten,
    header: "👤 Nhân viên",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 dark:text-gray-100">
        {row.original.nhanVien.ten}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.lichLamViec.ngay,
    header: "📅 Ngày làm việc",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {format(new Date(row.original.lichLamViec.ngay), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.lichLamViec.caLamViec.tenCa,
    header: "⏰ Ca làm việc",
    cell: ({ row }) => {
      const shiftName = row.original.lichLamViec.caLamViec.tenCa;
      return (
        <div className="flex items-center gap-2">
          <span>{getShiftIcon(shiftName)}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {shiftName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "thoiGianVao",
    header: "🕐 Giờ vào",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-green-600">📍</span>
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          {formatTime(row.getValue("thoiGianVao"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "thoiGianRa",
    header: "🕐 Giờ ra",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-red-600">📍</span>
        <span className="text-sm font-medium text-red-700 dark:text-red-400">
          {formatTime(row.getValue("thoiGianRa"))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "trangThaiChamCong",
    header: "📊 Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("trangThaiChamCong") as string;
      return (
        <Badge className={`border ${getStatusColor(status)}`}>
          <span className="mr-1">{getStatusIcon(status)}</span>
          {getStatusText(status)}
        </Badge>
      );
    },
  },
];
