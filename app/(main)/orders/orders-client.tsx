// file: app/(main)/orders/orders-client.tsx
"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { DonHangResponse } from "@/types/api";
import { getColumns } from "./columns";
import { OrderDetailModal } from "./order-detail-modal";
import { TrangThaiDonHang } from "@/constants/enums";

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

  // Calculate stats
  const totalOrders = data.length;
  const completedOrders = data.filter(
    (order) => order.trangThaiDonHang === TrangThaiDonHang.HOAN_THANH
  ).length;
  const pendingOrders = data.filter(
    (order) => order.trangThaiDonHang === TrangThaiDonHang.DANG_CHO
  ).length;
  const totalRevenue = data
    .filter(
      (order) =>
        order.trangThaiDonHang === TrangThaiDonHang.DA_THANH_TOAN ||
        order.trangThaiDonHang === TrangThaiDonHang.HOAN_THANH
    )
    .reduce((sum, order) => sum + order.tongTienThanhToan, 0);

  const todayOrders = data.filter((order) => {
    const orderDate = new Date(order.thoiGianTao).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  }).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <span className="text-white text-xl">📋</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Lịch sử Đơn hàng
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quản lý {totalOrders} đơn hàng
            </p>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Tổng đơn
              </p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {totalOrders}
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Hoàn thành
              </p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {completedOrders}
              </p>
            </div>
            <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                Đang xử lý
              </p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {pendingOrders}
              </p>
            </div>
            <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                Hôm nay
              </p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {todayOrders}
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                Doanh thu
              </p>
              <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                {totalRevenue.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          📋 Đơn hàng gần đây
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Đơn #{order.id} -{" "}
                {order.ban?.soBan ? `Bàn ${order.ban.soBan}` : "Mang về"}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                📅 {new Date(order.thoiGianTao).toLocaleDateString("vi-VN")}{" "}
                {new Date(order.thoiGianTao).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                💰 {order.tongTienThanhToan.toLocaleString("vi-VN")}₫
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Render modal chi tiết, nó chỉ hiện khi state là true */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
