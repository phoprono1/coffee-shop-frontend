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

  return <PromotionsClient data={promotionsData} />;
};

export default PromotionsPage;
