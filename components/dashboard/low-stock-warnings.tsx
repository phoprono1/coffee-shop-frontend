// file: components/dashboard/low-stock-warnings.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LowStockWarning } from "@/types/api";
import { AlertTriangle } from "lucide-react";

interface LowStockWarningsProps {
  data?: LowStockWarning[];
}

export const LowStockWarnings = ({ data }: LowStockWarningsProps) => {
  return (
    <Card className="col-span-12 md:col-span-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Cảnh báo Tồn kho thấp
        </CardTitle>
        <CardDescription>
          Các nguyên vật liệu đang dưới mức cảnh báo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((item) => (
            <div key={item.nguyenVatLieuId} className="flex items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.tenNguyenVatLieu}
                </p>
                <p className="text-sm text-muted-foreground">
                  Mức cảnh báo: {item.mucCanhBaoTonKho} {item.donViTinh}
                </p>
              </div>
              <div className="font-medium text-destructive">
                Còn lại: {item.soLuongTonHienTai} {item.donViTinh}
              </div>
            </div>
          ))}
          {data?.length === 0 && (
            <p className="text-sm text-muted-foreground">Tồn kho an toàn.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
