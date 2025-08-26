// file: app/(main)/table-map/table-map-client.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { BanResponse } from "@/types/api";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { locations } from "@/constants/locations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TableMapClientProps {
  initialTables: BanResponse[];
}

export const TableMapClient = ({ initialTables }: TableMapClientProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Dùng TanStack Query để dữ liệu tự động cập nhật
  const { data: tables, isLoading } = useQuery<BanResponse[]>({
    queryKey: ["tables"],
    queryFn: async () =>
      (
        await apiClient.get("/ban", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    initialData: initialTables,
    refetchInterval: 10000, // Tự động cập nhật sau mỗi 10 giây
  });

  const [selectedTable, setSelectedTable] = useState<BanResponse | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const updateStatusMutation = useMutation<
    BanResponse,
    Error,
    { id: number; trangThai: string }
  >({
    mutationFn: ({ id, trangThai }) =>
      apiClient.patch(
        `/ban/${id}/trang-thai?trangThai=${trangThai}`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }
      ),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái bàn thành công!");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      setIsAlertOpen(false);
    },
    onError: (error) => toast.error("Lỗi: " + error.message),
  });

  const handleTableClick = (table: BanResponse) => {
    if (table.trangThaiBan === "CAN_DON") {
      setSelectedTable(table);
      setIsAlertOpen(true);
    }
    // Có thể thêm logic khác cho các trạng thái còn lại sau
  };

  const confirmClearTable = () => {
    if (selectedTable) {
      updateStatusMutation.mutate({ id: selectedTable.id, trangThai: "TRONG" });
    }
  };

  const groupedTables =
    tables?.reduce(
      (acc, table) => {
        const location = table.viTri;
        if (!acc[location]) acc[location] = [];
        acc[location].push(table);
        return acc;
      },
      {} as Record<string, BanResponse[]>
    ) || {};

  const availableLocations = Object.keys(groupedTables);

  // Calculate stats
  const totalTables = tables?.length || 0;
  const availableTables =
    tables?.filter((t) => t.trangThaiBan === "TRONG").length || 0;
  const occupiedTables =
    tables?.filter((t) => t.trangThaiBan === "CO_KHACH").length || 0;
  const needCleaningTables =
    tables?.filter((t) => t.trangThaiBan === "CAN_DON").length || 0;
  const totalCapacity =
    tables?.reduce((sum, table) => sum + table.sucChua, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Table Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Bàn trống
              </p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {availableTables}
              </p>
            </div>
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                Có khách
              </p>
              <p className="text-xl font-bold text-red-900 dark:text-red-100">
                {occupiedTables}
              </p>
            </div>
            <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                Cần dọn
              </p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {needCleaningTables}
              </p>
            </div>
            <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🧹</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                Tổng ghế
              </p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {totalCapacity}
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🪑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          📋 Chú thích trạng thái
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✅ Bàn trống - Sẵn sàng phục vụ
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-red-700 dark:text-red-300 font-medium">
              👥 Có khách - Đang phục vụ
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
              🧹 Cần dọn - Nhấn để dọn bàn
            </span>
          </div>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận Dọn Bàn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ chuyển trạng thái của bàn &quot;
              {selectedTable?.soBan}&quot; thành TRỐNG.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearTable}>
              Hoàn tất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <Tabs defaultValue={availableLocations[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            {availableLocations.map((loc) => (
              <TabsTrigger
                key={loc}
                value={loc}
                className="flex items-center gap-2"
              >
                <span>📍</span>
                {locations.find((l) => l.value === loc)?.label || loc}
              </TabsTrigger>
            ))}
          </TabsList>
          {availableLocations.map((loc) => (
            <TabsContent key={loc} value={loc} className="mt-0">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 p-6">
                {isLoading &&
                  Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                {groupedTables[loc]?.map((table) => (
                  <Button
                    key={table.id}
                    variant="outline"
                    className={cn(
                      "h-20 flex-col text-sm transition-all duration-200 hover:scale-105",
                      {
                        "border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-800/30":
                          table.trangThaiBan === "TRONG",
                        "border-red-500 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-800/30":
                          table.trangThaiBan === "CO_KHACH",
                        "border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-800/30 cursor-pointer":
                          table.trangThaiBan === "CAN_DON",
                      }
                    )}
                    onClick={() => handleTableClick(table)}
                  >
                    <span className="font-bold text-base">
                      🪑 {table.soBan}
                    </span>
                    <span className="text-xs opacity-75">
                      {table.sucChua} ghế
                    </span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
