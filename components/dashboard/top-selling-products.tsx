// file: components/dashboard/top-selling-products.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopSellingItem } from "@/types/api";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

interface TopSellingProductsProps {
  data?: TopSellingItem[];
}

export const TopSellingProducts = ({ data }: TopSellingProductsProps) => {
  return (
    <Card className="col-span-12 md:col-span-4">
      <CardHeader>
        <CardTitle>Sản phẩm Bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((item) => (
            <div key={item.thucDonId} className="flex items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none truncate">
                  {item.tenMon}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.tongSoLuongBan} đã bán
                </p>
              </div>
              <div className="font-medium">
                {formatCurrency(item.tongDoanhThuTuMon)}
              </div>
            </div>
          ))}
          {data?.length === 0 && (
            <p className="text-sm text-muted-foreground">Không có dữ liệu.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
