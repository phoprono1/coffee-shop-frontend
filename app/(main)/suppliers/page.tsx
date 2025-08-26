// file: app/(main)/suppliers/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { NhaCungCapResponse } from "@/types/api";
import { SuppliersClient } from "./suppliers-client";

const getSuppliers = async (
  accessToken: string | undefined
): Promise<NhaCungCapResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/nha-cung-cap", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
    return [];
  }
};

const SuppliersPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const suppliersData = await getSuppliers(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Nhà cung cấp
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý thông tin các nhà cung cấp nguyên liệu và dịch vụ
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <SuppliersClient data={suppliersData} />
      </div>
    </div>
  );
};

export default SuppliersPage;
