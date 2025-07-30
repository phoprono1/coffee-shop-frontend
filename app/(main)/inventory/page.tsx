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

  return <InventoryClient data={inventoryData} />;
};

export default InventoryPage;
