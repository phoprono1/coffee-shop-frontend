// file: app/(pos)/pos/components/order-summary.tsx
"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MinusCircle, PlusCircle, Trash2, User, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import apiClient from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { BanResponse } from "@/types/api";
import { TableSelectionModal } from "./table-selection-modal";
import { PaymentModal } from "./payment-modal";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const OrderSummary = () => {
  const {
    items,
    table,
    setTable,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCartStore();

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const { data: session } = useSession(); // Cần session để gọi API

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Tính toán tổng tiền
  const subTotal = items.reduce(
    (acc, item) => acc + item.gia * item.quantity,
    0
  );
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

  const total = subTotal;
  // Tạm thời chưa có logic khuyến mãi

  return (
    <>
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
        items={items}
        table={table}
        subTotal={subTotal}
        total={total}
      />
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Đơn hàng hiện tại</h2>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Bàn: {table?.soBan || "Mang đi"}</span>
              {table && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setTable(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsTableModalOpen(true)}
            >
              Chọn bàn
            </Button>
          </div>
        </div>

        {/* Danh sách các món trong giỏ hàng */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có sản phẩm nào
              </p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.urlHinhAnh}
                    alt={item.tenMon}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.tenMon}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.gia)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-bold w-20 text-right">
                    {formatCurrency(item.gia * item.quantity)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Phần tổng kết và thanh toán */}
        {items.length > 0 && (
          <div className="p-4 border-t space-y-4 bg-slate-50">
            <div className="flex justify-between font-semibold">
              <span>Tạm tính:</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            {/* Sẽ thêm logic khuyến mãi ở đây */}
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={clearCart}>
                <X className="mr-2 h-4 w-4" /> Hủy đơn
              </Button>
              <Button onClick={() => setIsPaymentModalOpen(true)}>
                Thanh toán
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
