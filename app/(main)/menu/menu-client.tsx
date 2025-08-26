// file: app/(main)/menu/menu-client.tsx (Bộ não điều khiển)
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ThucDonResponse } from "@/types/api";
import { getColumns } from "./columns";
import { MenuForm } from "./menu-form"; // Import form đã đổi tên
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/axios";
import { RecipeForm } from "./recipe-form";

interface MenuClientProps {
  data: ThucDonResponse[];
}

export const MenuClient = ({ data }: MenuClientProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  // State cho form Sửa/Thêm
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<ThucDonResponse | null>(null);

  // State cho Alert Xóa
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<ThucDonResponse | null>(null);

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/thuc-don/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Xóa món ăn thành công!");
      router.refresh();
      setIsAlertOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // Thêm kiểu 'any' để truy cập response
      // Cố gắng lấy thông báo lỗi từ response của server
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

  // Khởi tạo các cột với các hàm callback
  const columns = getColumns({
    onEdit: (menuItem) => {
      setEditingData(menuItem);
      setIsFormOpen(true);
    },
    onDelete: (menuItem) => {
      setDeletingId(menuItem.id);
      setIsAlertOpen(true);
    },
    onManageRecipe: (menuItem) => {
      setSelectedMenuItem(menuItem);
      setIsRecipeModalOpen(true);
    },
  });

  return (
    <>
      <MenuForm
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

      <RecipeForm
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        menuItem={selectedMenuItem}
      />

      <div className="p-6 space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Danh sách thực đơn
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} món ăn trong hệ thống
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingData(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm món mới
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Món đang bán
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {data.length}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Giá trung bình
                </p>
                <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                  {data.length > 0
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        data.reduce((sum, item) => sum + item.gia, 0) /
                          data.length
                      )
                    : "0 ₫"}
                </p>
              </div>
              <div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">₫</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Danh mục
                </p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {new Set(data.map((item) => item.danhMuc?.tenDanhMuc)).size}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">#</span>
              </div>
            </div>
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
