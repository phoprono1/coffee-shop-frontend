// file: app/(main)/promotions/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { KhuyenMaiResponse } from "@/types/api";
import { PromotionsClient } from "./promotions-client";

const getPromotions = async (
  accessToken: string | undefined
): Promise<KhuyenMaiResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/khuyen-mai", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch promotions:", error);
    return [];
  }
};

const PromotionsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const promotionsData = await getPromotions(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Khuyến mãi
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tạo và quản lý các chương trình khuyến mãi, ưu đãi cho khách hàng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <PromotionsClient data={promotionsData} />
      </div>
    </div>
  );
};

export default PromotionsPage;
