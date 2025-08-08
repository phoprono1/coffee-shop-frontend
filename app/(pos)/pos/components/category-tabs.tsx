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
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {/* Nút "Tất cả" */}
      <Button
        variant={selectedCategoryId === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
      >
        Tất cả
      </Button>

      {/* Các nút danh mục */}
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.tenDanhMuc}
        </Button>
      ))}
    </div>
  );
};
