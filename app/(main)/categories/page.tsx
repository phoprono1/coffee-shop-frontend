// file: app/(main)/categories/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { DanhMucResponse } from "@/types/api";
import { CategoriesClient } from "./categories-client";

const getCategories = async (
  accessToken: string | undefined
): Promise<DanhMucResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/danh-muc", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

const CategoriesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const categoriesData = await getCategories(session.accessToken);

  return <CategoriesClient data={categoriesData} />;
};

export default CategoriesPage;
