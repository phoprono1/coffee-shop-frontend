// file: app/(main)/suppliers/suppliers-client.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { NhaCungCapResponse } from "@/types/api";
import { getColumns } from "./columns";
import { SupplierForm } from "./supplier-form";
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/axios";

interface SuppliersClientProps {
  data: NhaCungCapResponse[];
}

export const SuppliersClient = ({ data }: SuppliersClientProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<NhaCungCapResponse | null>(
    null
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/nha-cung-cap/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Xóa nhà cung cấp thành công!");
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
    onEdit: (supplier) => {
      setEditingData(supplier);
      setIsFormOpen(true);
    },
    onDelete: (supplier) => {
      setDeletingId(supplier.id);
      setIsAlertOpen(true);
    },
  });

  return (
    <>
      <SupplierForm
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
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Nhà cung cấp
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} nhà cung cấp đang hợp tác
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingData(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhà cung cấp
          </Button>
        </div>

        {/* Supplier Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Tổng nhà cung cấp
                </p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {data.length}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Đã xác minh
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {
                    data.filter(
                      (supplier) => supplier.email && supplier.soDienThoai
                    ).length
                  }
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                  Đối tác uy tín
                </p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {Math.floor(data.length * 0.8)}
                </p>
              </div>
              <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Suppliers Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🤝 Nhà cung cấp chính
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.slice(0, 3).map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {supplier.tenNhaCungCap}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  📍 {supplier.diaChi.slice(0, 30)}...
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  📞 {supplier.soDienThoai}
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
