// file: app/(pos)/pos/page.tsx (Cập nhật)
"use client";

import { useState } from "react"; // Import useState
import { CategoryTabs } from "./components/category-tabs";
import { MenuGrid } from "./components/menu-grid";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/axios";
import { DanhMucResponse, ThucDonResponse } from "@/types/api";
import { OrderSummary } from "./components/order-summary";

const PosPage = () => {
  const { data: session } = useSession();

  // State để quản lý danh mục đang được chọn. Mặc định là null (hiển thị tất cả).
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const { data: categories, isLoading: isLoadingCategories } = useQuery<
    DanhMucResponse[]
  >({
    queryKey: ["categories"],
    queryFn: async () =>
      (
        await apiClient.get("/danh-muc", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });

  const { data: menuItems, isLoading: isLoadingMenu } = useQuery<
    ThucDonResponse[]
  >({
    queryKey: ["menu"],
    queryFn: async () =>
      (
        await apiClient.get("/thuc-don", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });

  // Lọc danh sách món ăn dựa trên danh mục đã chọn
  const filteredMenuItems = selectedCategoryId
    ? menuItems?.filter((item) => item.danhMuc.id === selectedCategoryId)
    : menuItems;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Panel - Menu Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b p-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ☕ Giao diện bán hàng
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chọn sản phẩm để thêm vào đơn hàng
          </p>
        </div>

        {/* Category Tabs */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b flex-shrink-0">
          <CategoryTabs
            categories={categories}
            isLoading={isLoadingCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>

        {/* Menu Grid - Scrollable */}
        <div className="flex-1 min-h-0 bg-gray-50 dark:bg-gray-900 p-4">
          <MenuGrid menuItems={filteredMenuItems} isLoading={isLoadingMenu} />
        </div>
      </div>

      {/* Right Panel - Order Summary */}
      <div className="w-96 bg-white dark:bg-gray-800 shadow-xl border-l flex-shrink-0">
        <OrderSummary />
      </div>
    </div>
  );
};

export default PosPage;
