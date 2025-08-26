// file: app/(main)/inventory/inventory-client.tsx (Phiên bản đã sửa)
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { NguyenVatLieuResponse } from "@/types/api";
import { getColumns } from "./columns";
import { InventoryForm } from "./inventory-form"; // Import form đúng
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/axios";

interface InventoryClientProps {
  data: NguyenVatLieuResponse[];
}

export const InventoryClient = ({ data }: InventoryClientProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<NguyenVatLieuResponse | null>(
    null
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      // Cập nhật endpoint
      await apiClient.delete(`/nguyen-vat-lieu/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Xóa nguyên vật liệu thành công!");
      router.refresh();
      setIsAlertOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra khi xóa.";
      toast.error(errorMessage);
    },
  });

  const onConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  // Cập nhật getColumns, xóa bỏ onManageRecipe
  const columns = getColumns({
    onEdit: (material) => {
      setEditingData(material);
      setIsFormOpen(true);
    },
    onDelete: (material) => {
      setDeletingId(material.id);
      setIsAlertOpen(true);
    },
  });

  return (
    <>
      <InventoryForm
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
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Nguyên vật liệu
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} loại nguyên liệu trong kho
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingData(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm nguyên liệu
          </Button>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Còn hàng
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {
                    data.filter(
                      (item) => item.soLuongTonHienTai > item.mucCanhBaoTonKho
                    ).length
                  }
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                  Sắp hết
                </p>
                <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  {
                    data.filter(
                      (item) =>
                        item.soLuongTonHienTai <= item.mucCanhBaoTonKho &&
                        item.soLuongTonHienTai > 0
                    ).length
                  }
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">⚠</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  Hết hàng
                </p>
                <p className="text-xl font-bold text-red-900 dark:text-red-100">
                  {data.filter((item) => item.soLuongTonHienTai === 0).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">✕</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Tổng loại
                </p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {data.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">#</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {data.filter((item) => item.soLuongTonHienTai <= item.mucCanhBaoTonKho)
          .length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Cảnh báo tồn kho thấp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {data
                .filter(
                  (item) => item.soLuongTonHienTai <= item.mucCanhBaoTonKho
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-yellow-700 dark:text-yellow-300"
                  >
                    <span className="font-medium">{item.tenNguyenLieu}</span>:{" "}
                    {item.soLuongTonHienTai} {item.donViTinh}
                    (tối thiểu: {item.mucCanhBaoTonKho})
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
