// file: app/(main)/orders/orders-client.tsx
"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { DonHangResponse } from "@/types/api";
import { getColumns } from "./columns";
import { OrderDetailModal } from "./order-detail-modal";

interface OrdersClientProps {
  data: DonHangResponse[];
}

export const OrdersClient = ({ data }: OrdersClientProps) => {
  // State để quản lý modal xem chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DonHangResponse | null>(
    null
  );

  // Khởi tạo các cột và truyền vào hàm callback `onViewDetail`
  const columns = getColumns({
    onViewDetail: (order) => {
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    },
  });

  return (
    <>
      {/* Render modal chi tiết, nó chỉ hiện khi state là true */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Lịch sử Đơn hàng ({data.length})
          </h1>
          {/* Không có nút "Thêm mới" ở đây */}
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};
