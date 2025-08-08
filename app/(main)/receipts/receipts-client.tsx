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
      {/* Sửa: Xóa prop initialData */}
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Phiếu Nhập Kho ({data.length})
          </h1>
          {/* Sửa: Nút này chỉ mở form, không cần set editingData */}
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tạo phiếu nhập
          </Button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};
