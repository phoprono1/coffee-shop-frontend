// file: app/(pos)/pos/components/promotion-selection-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { KhuyenMaiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

interface PromotionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotions?: KhuyenMaiResponse[];
  isLoading: boolean;
  onSelectPromotion: (promotion: KhuyenMaiResponse) => void;
}

export const PromotionSelectionModal = ({
  isOpen,
  onClose,
  promotions,
  isLoading,
  onSelectPromotion,
}: PromotionSelectionModalProps) => {
  const handleSelect = (promotion: KhuyenMaiResponse) => {
    onSelectPromotion(promotion);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chọn Khuyến Mãi</DialogTitle>
          <DialogDescription>
            Chỉ các chương trình hợp lệ mới được hiển thị.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-2 p-1">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            {promotions?.map((promo) => (
              <div
                key={promo.id}
                className="border p-4 rounded-lg cursor-pointer hover:bg-slate-50 flex justify-between items-center"
                onClick={() => handleSelect(promo)}
              >
                <div>
                  <p className="font-bold">{promo.tenKhuyenMai}</p>
                  <p className="text-sm text-muted-foreground">{promo.moTa}</p>
                  <p className="text-xs mt-1">
                    Áp dụng cho đơn hàng từ:{" "}
                    {formatCurrency(promo.giaTriToiThieuApDung)}
                  </p>
                </div>
                <Badge>
                  {promo.phanTramGiamGia > 0
                    ? `${promo.phanTramGiamGia}%`
                    : formatCurrency(promo.giaTriGiamGiaCoDinh)}
                </Badge>
              </div>
            ))}
            {promotions?.length === 0 && !isLoading && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Không có khuyến mãi nào hợp lệ.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
