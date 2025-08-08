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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Khuyến Mãi ({data.length})
          </h1>
          <Button
            onClick={() => {
              setEditingData(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};
