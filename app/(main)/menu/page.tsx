// file: app/(main)/menu/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { ThucDonResponse } from "@/types/api";
import { MenuClient } from "./menu-client";

// Hàm lấy dữ liệu từ API
const getMenu = async (
  accessToken: string | undefined
): Promise<ThucDonResponse[]> => {
  if (!accessToken) {
    return [];
  }
  try {
    const response = await apiClient.get("/thuc-don", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return [];
  }
};

const MenuPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const menuData = await getMenu(session.accessToken);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Thực đơn
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý các món ăn, thức uống và giá cả trong thực đơn
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <MenuClient data={menuData} />
      </div>
    </div>
  );
};

export default MenuPage;
