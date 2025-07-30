// file: app/(main)/employees/employees-client.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { NhanVienResponse } from "@/types/api";
import { getColumns } from "./columns";
import { EmployeeForm } from "./employee-form";
import { AlertModal } from "@/components/modals/alert-modal";
import apiClient from "@/lib/axios";

interface EmployeesClientProps {
  data: NhanVienResponse[];
}

export const EmployeesClient = ({ data }: EmployeesClientProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<NhanVienResponse | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/nhan-vien/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Xóa nhân viên thành công!");
      router.refresh();
      setIsAlertOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa.");
    },
  });

  const onConfirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const columns = getColumns({
    onEdit: (employee) => {
      setEditingData(employee);
      setIsFormOpen(true);
    },
    onDelete: (employee) => {
      setDeletingId(employee.id);
      setIsAlertOpen(true);
    },
  });

  return (
    <>
      <EmployeeForm
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
            Quản lý Nhân viên ({data.length})
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
