// file: app/(main)/categories/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { DanhMucResponse } from "@/types/api";
import { CategoriesClient } from "./categories-client";

const getCategories = async (
  accessToken: string | undefined
): Promise<DanhMucResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/danh-muc", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

const CategoriesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const categoriesData = await getCategories(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Danh mục
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Phân loại và tổ chức các nhóm sản phẩm trong thực đơn
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <CategoriesClient data={categoriesData} />
      </div>
    </div>
  );
};

export default CategoriesPage;
