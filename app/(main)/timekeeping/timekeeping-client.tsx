// file: app/(main)/timekeeping/timekeeping-client.tsx
"use client";

import { DataTable } from "@/components/ui/data-table";
import { ChamCongResponse } from "@/types/api";
import { columns } from "./columns";

interface TimekeepingClientProps {
  data: ChamCongResponse[];
}

export const TimekeepingClient = ({ data }: TimekeepingClientProps) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Dữ liệu Chấm công
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data.length} bản ghi chấm công
            </p>
          </div>
        </div>
      </div>

      {/* Timekeeping Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Tổng bản ghi
              </p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {data.length}
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Hôm nay
              </p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {
                  data.filter((record) => {
                    const today = new Date().toISOString().split("T")[0];
                    return record.lichLamViec.ngay === today;
                  }).length
                }
              </p>
            </div>
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                Tuần này
              </p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {
                  data.filter((record) => {
                    const recordDate = new Date(record.lichLamViec.ngay);
                    const today = new Date();
                    const startOfWeek = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - today.getDay()
                    );
                    return recordDate >= startOfWeek && recordDate <= today;
                  }).length
                }
              </p>
            </div>
            <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                Có chấm công
              </p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {
                  data.filter(
                    (record) => record.thoiGianVao && record.thoiGianRa
                  ).length
                }
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⏰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          🕒 Chấm công gần đây
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data
            .slice(-3)
            .reverse()
            .map((record) => (
              <div
                key={record.id}
                className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {record.nhanVien.ten}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  📅{" "}
                  {new Date(record.lichLamViec.ngay).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ⏰{" "}
                  {record.thoiGianVao
                    ? new Date(record.thoiGianVao).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Chưa vào"}{" "}
                  -{" "}
                  {record.thoiGianRa
                    ? new Date(record.thoiGianRa).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Chưa ra"}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
