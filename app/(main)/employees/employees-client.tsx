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

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quản lý Nhân viên
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} nhân viên trong hệ thống
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
            Thêm nhân viên
          </Button>
        </div>

        {/* Employee Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Tổng nhân viên
                </p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {data.length}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Quản lý
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {data.filter((emp) => emp.chucVu === "QUAN_LY").length}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👔</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                  Nhân viên bán hàng
                </p>
                <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {
                    data.filter((emp) => emp.chucVu === "NHAN_VIEN_BAN_HANG")
                      .length
                  }
                </p>
              </div>
              <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🛍️</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                  Lương trung bình
                </p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {data.length > 0
                    ? Math.round(
                        data.reduce((sum, emp) => sum + emp.luongCoBan, 0) /
                          data.length /
                          1000000
                      )
                    : 0}
                  M
                </p>
              </div>
              <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Employees */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            👤 Nhân viên mới nhất
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data
              .slice(-3)
              .reverse()
              .map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {employee.ten}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💼 {employee.chucVu.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    📅{" "}
                    {new Date(employee.ngayVaoLam).toLocaleDateString("vi-VN")}
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
