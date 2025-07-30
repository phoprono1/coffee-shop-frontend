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

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Kho ({data.length})
          </h1>
          <Button
            onClick={() => {
              setEditingData(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};
