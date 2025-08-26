// file: app/(main)/promotions/promotions-client.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { KhuyenMaiResponse } from "@/types/api";
import { getColumns } from "./columns";
import { PromotionForm } from "./promotion-form";
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/axios";

interface PromotionsClientProps {
  data: KhuyenMaiResponse[];
}

export const PromotionsClient = ({ data }: PromotionsClientProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<KhuyenMaiResponse | null>(
    null
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/khuyen-mai/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Xóa khuyến mãi thành công!");
      router.refresh();
      setIsAlertOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra."),
  });

  const onConfirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const columns = getColumns({
    onEdit: (promotion) => {
      setEditingData(promotion);
      setIsFormOpen(true);
    },
    onDelete: (promotion) => {
      setDeletingId(promotion.id);
      setIsAlertOpen(true);
    },
  });

  return (
    <>
      <PromotionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingData(null);
        }}
        initialData={editingData}
      />
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onConfirmDelete}
        loading={deleteMutation.isPending}
      />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Khuyến mãi
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} chương trình khuyến mãi
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingData(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo khuyến mãi
          </Button>
        </div>

        {/* Promotion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Tổng khuyến mãi
                </p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {data.length}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🎫</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Đang hoạt động
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {
                    data.filter((promo) => {
                      const now = new Date();
                      const startDate = new Date(promo.ngayBatDau);
                      const endDate = new Date(promo.ngayKetThuc);
                      return (
                        promo.trangThaiKichHoat &&
                        now >= startDate &&
                        now <= endDate
                      );
                    }).length
                  }
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                  Sắp diễn ra
                </p>
                <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  {
                    data.filter((promo) => {
                      const now = new Date();
                      const startDate = new Date(promo.ngayBatDau);
                      return promo.trangThaiKichHoat && now < startDate;
                    }).length
                  }
                </p>
              </div>
              <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⏰</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-700 dark:text-pink-300 font-medium">
                  Giảm giá % trung bình
                </p>
                <p className="text-xl font-bold text-pink-900 dark:text-pink-100">
                  {data.length > 0
                    ? Math.round(
                        data.reduce(
                          (sum, promo) => sum + promo.phanTramGiamGia,
                          0
                        ) / data.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="h-10 w-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Promotions Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🎯 Khuyến mãi nổi bật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data
              .filter((promo) => {
                const now = new Date();
                const startDate = new Date(promo.ngayBatDau);
                const endDate = new Date(promo.ngayKetThuc);
                return (
                  promo.trangThaiKichHoat && now >= startDate && now <= endDate
                );
              })
              .slice(0, 3)
              .map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {promo.tenKhuyenMai}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    🎫 Giảm {promo.phanTramGiamGia}%
                  </p>
                  <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                    📅 Đến{" "}
                    {new Date(promo.ngayKetThuc).toLocaleDateString("vi-VN")}
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
    </>
  );
};
