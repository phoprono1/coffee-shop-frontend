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
    <div className="grid grid-cols-12 gap-4 h-full p-4">
      <div className="col-span-8 flex flex-col gap-4 h-full">
        <h1 className="text-2xl font-bold">Tạo Đơn Hàng Mới</h1>
        <CategoryTabs
          categories={categories}
          isLoading={isLoadingCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId} // Truyền hàm để thay đổi state
        />
        <MenuGrid
          menuItems={filteredMenuItems} // Truyền danh sách đã lọc
          isLoading={isLoadingMenu}
        />
      </div>
      <div className="col-span-4 bg-white rounded-lg shadow-md">
        <OrderSummary />
      </div>
    </div>
  );
};

export default PosPage;
