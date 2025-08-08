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

  return <ReceiptsClient data={receiptsData} />;
};

export default ReceiptsPage;
