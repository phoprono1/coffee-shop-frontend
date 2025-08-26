// file: app/(main)/receipts/receipts-client.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PhieuNhapKhoResponse } from "@/types/api";
import { getColumns } from "./columns";
import { ReceiptForm } from "./receipt-form"; // Sửa: Viết hoa tên component
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/axios";
import { ReceiptDetailModal } from "./receipt-detail-modal";

interface ReceiptsClientProps {
  data: PhieuNhapKhoResponse[];
}

export const ReceiptsClient = ({ data }: ReceiptsClientProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Chỉ cần state cho việc mở form Thêm mới
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // State mới cho modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] =
    useState<PhieuNhapKhoResponse | null>(null);

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      // Sửa: Endpoint API xóa phiếu nhập kho
      await apiClient.delete(`/phieu-nhap-kho/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      // Sửa: Thông báo toast
      toast.success("Xóa phiếu nhập kho thành công!");
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

  // Sửa: Xóa onEdit vì không có chức năng sửa phiếu nhập
  const columns = getColumns({
    onDetail: (receipt) => {
      setSelectedReceipt(receipt);
      setIsDetailModalOpen(true);
    },
    onDelete: (receipt) => {
      setDeletingId(receipt.id);
      setIsAlertOpen(true);
    },
  });

  return (
    <>
      <ReceiptForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onConfirmDelete}
        loading={deleteMutation.isPending}
      />
      <ReceiptDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        receipt={selectedReceipt}
      />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Phiếu nhập kho
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} phiếu nhập trong hệ thống
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo phiếu nhập
          </Button>
        </div>

        {/* Receipt Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Tổng phiếu
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
                  Tháng này
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {
                    data.filter((item) => {
                      const currentMonth = new Date().getMonth();
                      const itemMonth = new Date(item.ngayNhap).getMonth();
                      return itemMonth === currentMonth;
                    }).length
                  }
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Tổng giá trị
                </p>
                <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(
                    data.reduce(
                      (sum, item) => sum + (item.tongTienNhap || 0),
                      0
                    )
                  )}
                </p>
              </div>
              <div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Receipts Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            📊 Phiếu nhập gần đây
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.slice(0, 3).map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  Phiếu #{receipt.id}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(receipt.ngayNhap).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(receipt.tongTienNhap || 0)}
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
