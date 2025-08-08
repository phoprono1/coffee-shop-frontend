// file: app/(main)/suppliers/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { NhaCungCapResponse } from "@/types/api";
import { SuppliersClient } from "./suppliers-client";

const getSuppliers = async (
  accessToken: string | undefined
): Promise<NhaCungCapResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/nha-cung-cap", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
    return [];
  }
};

const SuppliersPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const suppliersData = await getSuppliers(session.accessToken);

  return <SuppliersClient data={suppliersData} />;
};

export default SuppliersPage;
