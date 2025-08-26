// file: app/(pos)/pos/components/order-summary.tsx
"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MinusCircle, PlusCircle, Tag, Trash2, User, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import apiClient from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { BanResponse, KhuyenMaiResponse } from "@/types/api";
import { TableSelectionModal } from "./table-selection-modal";
import { PaymentModal } from "./payment-modal";
import { PromotionSelectionModal } from "./promotion-selection-modal";
import { CartItemNote } from "./cart-item-note";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const OrderSummary = () => {
  const {
    items,
    table,
    promotion,
    setPromotion,
    setTable,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCartStore();

  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const { data: session } = useSession(); // Cần session để gọi API

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch danh sách khuyến mãi
  const { data: promotions, isLoading: isLoadingPromotions } = useQuery<
    KhuyenMaiResponse[]
  >({
    queryKey: ["promotions"],
    queryFn: async () =>
      (
        await apiClient.get("/khuyen-mai", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });

  // Lọc chỉ những khuyến mãi đang hoạt động
  const activePromotions = promotions?.filter((p) => p.trangThaiKichHoat);

  // Fetch danh sách bàn
  const { data: tables, isLoading: isLoadingTables } = useQuery<BanResponse[]>({
    queryKey: ["tables"],
    queryFn: async () =>
      (
        await apiClient.get("/ban", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });
  // TÍNH TOÁN LẠI TỔNG TIỀN
  const subTotal = items.reduce(
    (acc, item) => acc + item.gia * item.quantity,
    0
  );

  let total = subTotal;
  let discountAmount = 0;

  if (promotion && subTotal >= promotion.giaTriToiThieuApDung) {
    if (promotion.phanTramGiamGia > 0) {
      discountAmount = subTotal * (promotion.phanTramGiamGia / 100);
    } else if (promotion.giaTriGiamGiaCoDinh > 0) {
      discountAmount = promotion.giaTriGiamGiaCoDinh;
    }
    total = subTotal - discountAmount;
  } else if (promotion) {
    // Nếu đơn hàng không đủ điều kiện, tự động bỏ khuyến mãi
    setPromotion(null);
  }

  return (
    <div className="flex flex-col h-screen">
      <PromotionSelectionModal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        promotions={activePromotions}
        isLoading={isLoadingPromotions}
        onSelectPromotion={(promo) => setPromotion(promo)}
      />
      <TableSelectionModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        tables={tables}
        isLoading={isLoadingTables}
        onSelectTable={(selectedTable) => setTable(selectedTable)}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Header - Fixed */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400">🛒</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Đơn hàng
          </h2>
        </div>

        {/* Table Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span className="font-medium">
              {table?.soBan ? `Bàn ${table.soBan}` : "Mang đi"}
            </span>
            {table && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-red-100 dark:hover:bg-red-900/20"
                onClick={() => setTable(null)}
              >
                <X className="h-3 w-3 text-red-500" />
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            onClick={() => setIsTableModalOpen(true)}
          >
            Chọn bàn
          </Button>
        </div>
      </div>

      {/* Order Items - Scrollable */}
      <div className="flex-1 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
            <span className="text-6xl mb-4">🛒</span>
            <p className="text-lg font-medium">Chưa có sản phẩm</p>
            <p className="text-sm text-center">
              Chọn sản phẩm từ menu để thêm vào đơn hàng
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={item.urlHinhAnh}
                      alt={item.tenMon}
                      width={48}
                      height={48}
                      className="rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {item.tenMon}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatCurrency(item.gia)}
                      </p>
                      {item.note && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 italic mt-1 break-words">
                          💬 {item.note}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <MinusCircle className="h-3 w-3" />
                      </Button>
                      <span className="font-bold w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <CartItemNote itemId={item.id} initialNote={item.note} />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.gia * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Summary & Actions - Fixed Bottom */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          {/* Subtotal */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tạm tính:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(subTotal)}
            </span>
          </div>

          {/* Promotion */}
          <div className="flex justify-between items-center mb-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={() => setIsPromotionModalOpen(true)}
            >
              <Tag className="mr-1 h-3 w-3" />
              {promotion ? "Thay đổi KM" : "Áp dụng KM"}
            </Button>
            {promotion && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(discountAmount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setPromotion(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Tổng cộng:
            </span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={clearCart}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <X className="mr-1 h-4 w-4" />
              Hủy đơn
            </Button>
            <Button
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              💳 Thanh toán
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
