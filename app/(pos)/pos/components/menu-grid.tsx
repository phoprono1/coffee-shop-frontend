// file: app/(pos)/pos/components/menu-grid.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pr-2">
      {menuItems?.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => addItem(item)}
        >
          <CardHeader className="p-0">
            <AspectRatio ratio={4 / 3}>
              <Image
                src={item.urlHinhAnh}
                alt={item.tenMon}
                fill
                className="rounded-t-lg object-cover"
              />
            </AspectRatio>
          </CardHeader>
          <CardContent className="p-2">
            <h3 className="font-semibold text-sm truncate">{item.tenMon}</h3>
          </CardContent>
          <CardFooter className="p-2 pt-0">
            <p className="text-sm font-bold text-red-600">
              {formatCurrency(item.gia)}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
