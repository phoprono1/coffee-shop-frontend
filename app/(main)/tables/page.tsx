// file: app/(main)/tables/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { BanResponse } from "@/types/api";
import { TablesClient } from "./tables-client";

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

const TablesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tablesData = await getTables(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Thiết lập Bàn
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý và thiết lập các bàn trong quán cà phê
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <TablesClient data={tablesData} />
      </div>
    </div>
  );
};

export default TablesPage;
