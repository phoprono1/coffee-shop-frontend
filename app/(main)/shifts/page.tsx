// file: app/(main)/categories/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { CaLamViecResponse } from "@/types/api";
import { ShiftsClient } from "./shifts-client";

const getShifts = async (
  accessToken: string | undefined
): Promise<CaLamViecResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/ca-lam-viec", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shifts:", error);
    return [];
  }
};

const ShiftsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const shiftsData = await getShifts(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Ca làm việc
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thiết lập và quản lý các ca làm việc cho nhân viên
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <ShiftsClient data={shiftsData} />
      </div>
    </div>
  );
};

export default ShiftsPage;
