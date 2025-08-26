// file: app/(main)/inventory/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { NguyenVatLieuResponse } from "@/types/api";
import { InventoryClient } from "./inventory-client"; // Component client

const getInventory = async (
  accessToken: string | undefined
): Promise<NguyenVatLieuResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/nguyen-vat-lieu", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return [];
  }
};

const InventoryPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const inventoryData = await getInventory(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Kho
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Theo dõi và quản lý nguyên vật liệu trong kho
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <InventoryClient data={inventoryData} />
      </div>
    </div>
  );
};

export default InventoryPage;
