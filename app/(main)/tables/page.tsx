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

  return <TablesClient data={tablesData} />;
};

export default TablesPage;
