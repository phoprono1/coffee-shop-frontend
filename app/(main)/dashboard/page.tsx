// file: app/(main)/dashboard/page.tsx (Đã sửa lỗi)

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { isToday } from "date-fns";
import { DollarSign, ShoppingBag, Users } from "lucide-react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import apiClient from "@/lib/axios";
import { BanResponse, DonHangResponse } from "@/types/api";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentOrders } from "@/components/dashboard/recent-orders";

// Hàm định dạng tiền tệ không đổi
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// === THAY ĐỔI QUAN TRỌNG 1 ===
// Hàm bây giờ sẽ nhận accessToken làm tham số
async function getDashboardData(accessToken: string | undefined) {
  // Nếu không có token, không thể gọi API
  if (!accessToken) {
    console.error("No access token provided for dashboard data fetching.");
    return {
      totalRevenueToday: 0,
      totalOrdersToday: 0,
      occupiedTablesCount: 0,
      recentOrders: [],
    };
  }

  try {
    // === THAY ĐỔI QUAN TRỌNG 2 ===
    // Tạo header với token để gửi kèm trong mỗi request
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Gọi API với header đã được thêm vào
    const [ordersResponse, tablesResponse] = await Promise.all([
      apiClient.get<DonHangResponse[]>("/don-hang", { headers }),
      apiClient.get<BanResponse[]>("/ban", { headers }),
    ]);

    const allOrders = ordersResponse.data;
    const allTables = tablesResponse.data;
    
    // Phần logic còn lại không đổi
    const todayOrders = allOrders.filter(order => isToday(new Date(order.thoiGianTao)));
    const totalRevenueToday = todayOrders.reduce((sum, order) => sum + order.tongTienThanhToan, 0);
    const totalOrdersToday = todayOrders.length;
    const occupiedTablesCount = allTables.filter(table => table.trangThaiBan === "CO_KHACH").length;
    const recentOrders = allOrders.sort((a, b) => new Date(b.thoiGianTao).getTime() - new Date(a.thoiGianTao).getTime()).slice(0, 5);


    return {
      totalRevenueToday,
      totalOrdersToday,
      occupiedTablesCount,
      recentOrders,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return {
      totalRevenueToday: 0,
      totalOrdersToday: 0,
      occupiedTablesCount: 0,
      recentOrders: [],
    };
  }
}

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // === THAY ĐỔI QUAN TRỌNG 3 ===
  // Lấy accessToken từ session
  const accessToken = session.accessToken;

  // Truyền accessToken vào hàm lấy dữ liệu
  const {
    totalRevenueToday,
    totalOrdersToday,
    occupiedTablesCount,
    recentOrders,
  } = await getDashboardData(accessToken);
  
  // Phần render giao diện không đổi
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Doanh thu hôm nay"
          value={formatCurrency(totalRevenueToday)}
          icon={DollarSign}
        />
        <StatCard
          title="Đơn hàng hôm nay"
          value={totalOrdersToday}
          icon={ShoppingBag}
        />
        <StatCard
          title="Bàn có khách"
          value={`${occupiedTablesCount}`}
          icon={Users}
        />
      </div>

      <div className="grid gap-4">
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
};

export default DashboardPage;