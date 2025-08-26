// file: app/(pos)/pos/components/category-tabs.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DanhMucResponse } from "@/types/api";

interface CategoryTabsProps {
  categories?: DanhMucResponse[];
  isLoading: boolean;
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export const CategoryTabs = ({
  categories,
  isLoading,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {/* Nút "Tất cả" */}
      <Button
        variant={selectedCategoryId === null ? "default" : "outline"}
        className={cn(
          "whitespace-nowrap flex-shrink-0 transition-all",
          selectedCategoryId === null
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
        onClick={() => onSelectCategory(null)}
      >
        <span className="mr-1">🍽️</span>
        Tất cả
      </Button>

      {/* Các nút danh mục */}
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          className={cn(
            "whitespace-nowrap flex-shrink-0 transition-all",
            selectedCategoryId === category.id
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          <span className="mr-1">📂</span>
          {category.tenDanhMuc}
        </Button>
      ))}
    </div>
  );
};
