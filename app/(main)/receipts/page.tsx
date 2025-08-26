// file: app/(main)/receipts/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { PhieuNhapKhoResponse } from "@/types/api";
import { ReceiptsClient } from "./receipts-client";

const getReceipts = async (
  accessToken: string | undefined
): Promise<PhieuNhapKhoResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/phieu-nhap-kho", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch receipts:", error);
    return [];
  }
};

const ReceiptsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const receiptsData = await getReceipts(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Phiếu Nhập Kho
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý các phiếu nhập nguyên vật liệu vào kho
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <ReceiptsClient data={receiptsData} />
      </div>
    </div>
  );
};

export default ReceiptsPage;
