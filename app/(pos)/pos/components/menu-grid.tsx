// file: app/(pos)/pos/components/menu-grid.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThucDonResponse } from "@/types/api";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";

interface MenuGridProps {
  menuItems?: ThucDonResponse[];
  isLoading: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const MenuGrid = ({ menuItems, isLoading }: MenuGridProps) => {
  const { addItem } = useCartStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 h-full overflow-y-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-lg font-medium">Không có sản phẩm nào</p>
          <p className="text-sm">Vui lòng chọn danh mục khác</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 h-full overflow-y-auto">
      {menuItems.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-fit"
          onClick={() => addItem(item)}
        >
          <CardHeader className="p-0">
            <AspectRatio ratio={4 / 3}>
              <Image
                src={item.urlHinhAnh}
                alt={item.tenMon}
                fill
                className="rounded-t-lg object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </AspectRatio>
          </CardHeader>
          <CardContent className="p-3">
            <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">
              {item.tenMon}
            </h3>
            {item.moTa && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {item.moTa}
              </p>
            )}
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(item.gia)}
              </p>
              <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                <span>+</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
