// file: app/(main)/table-map/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { BanResponse } from "@/types/api";
import { TableMapClient } from "./table-map-client";

const getTables = async (
  accessToken: string | undefined
): Promise<BanResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/ban", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    return [];
  }
};

const TableMapPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tablesData = await getTables(session.accessToken);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <span className="text-white text-xl">🗺️</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Sơ đồ Bàn
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quản lý {tablesData.length} bàn trong nhà hàng
            </p>
          </div>
        </div>
      </div>

      <TableMapClient initialTables={tablesData} />
    </div>
  );
};

export default TableMapPage;
