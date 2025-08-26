// file: app/(main)/dashboard/page.tsx
"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { DollarSign, Package, ShoppingBag, BarChart } from "lucide-react";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import apiClient from "@/lib/axios";
import {
  CategorySalesReport,
  DailySalesReport,
  LowStockWarning,
  PaymentMethodSales,
  ProfitSummaryReport,
  StaffSalesReport,
  TopSellingItem,
} from "@/types/api";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopSellingProducts } from "@/components/dashboard/top-selling-products";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { PaymentMethodPieChart } from "@/components/dashboard/payment-method-pie-chart";
import { StaffSalesReportWidget } from "@/components/dashboard/staff-sales-report";
import { LowStockWarnings } from "@/components/dashboard/low-stock-warnings";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const DashboardPage = () => {
  const { data: session } = useSession();
  // State cho bộ lọc ngày, mặc định là 7 ngày qua
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });

  // Format ngày để truyền vào API
  const formattedStartDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : undefined;
  const formattedEndDate = dateRange?.to
    ? format(dateRange.to, "yyyy-MM-dd")
    : undefined;

  // Query để lấy dữ liệu doanh thu
  const { data: salesData, isLoading: isLoadingSales } = useQuery<
    DailySalesReport[]
  >({
    queryKey: ["dailySales", formattedStartDate, formattedEndDate],
    queryFn: async () =>
      (
        await apiClient.get(
          `/reports/sales/daily?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        )
      ).data,
    enabled: !!session && !!formattedStartDate && !!formattedEndDate,
  });

  // Query để lấy dữ liệu lợi nhuận
  const { data: profitData, isLoading: isLoadingProfit } = useQuery<
    ProfitSummaryReport[]
  >({
    queryKey: ["profitSummary", formattedStartDate, formattedEndDate],
    queryFn: async () =>
      (
        await apiClient.get(
          `/reports/profit/summary?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        )
      ).data,
    enabled: !!session && !!formattedStartDate && !!formattedEndDate,
  });

  // Query để lấy cảnh báo tồn kho
  const { data: lowStockData, isLoading: isLoadingStock } = useQuery<
    LowStockWarning[]
  >({
    queryKey: ["lowStock"],
    queryFn: async () =>
      (
        await apiClient.get("/reports/inventory/low-stock", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });

  // Tính toán các chỉ số tổng hợp
  const totalRevenue =
    salesData?.reduce((sum, day) => sum + day.tongDoanhThu, 0) || 0;
  const totalOrders =
    salesData?.reduce((sum, day) => sum + day.soLuongDonHang, 0) || 0;
  const totalProfit =
    profitData?.reduce((sum, day) => sum + day.tongLoiNhuanGop, 0) || 0;
  const lowStockCount = lowStockData?.length || 0;

  // Query để lấy top sản phẩm bán chạy
  const { data: topSellingData, isLoading: isLoadingTopSelling } = useQuery<
    TopSellingItem[]
  >({
    queryKey: ["topSelling", formattedStartDate, formattedEndDate],
    queryFn: async () =>
      (
        await apiClient.get(
          `/reports/sales/top-selling-items?startDate=${formattedStartDate}&endDate=${formattedEndDate}&limit=5`,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        )
      ).data,
    enabled: !!session && !!formattedStartDate && !!formattedEndDate,
  });

  // Query để lấy doanh thu theo danh mục
  const { data: categorySalesData, isLoading: isLoadingCategorySales } =
    useQuery<CategorySalesReport[]>({
      queryKey: ["categorySales", formattedStartDate, formattedEndDate],
      queryFn: async () =>
        (
          await apiClient.get(
            `/reports/sales/category?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
            { headers: { Authorization: `Bearer ${session?.accessToken}` } }
          )
        ).data,
      enabled: !!session && !!formattedStartDate && !!formattedEndDate,
    });

  // Query để lấy doanh thu theo PTTT
  const { data: paymentMethodData, isLoading: isLoadingPaymentMethods } =
    useQuery<PaymentMethodSales[]>({
      queryKey: ["paymentMethodSales", formattedStartDate, formattedEndDate],
      queryFn: async () =>
        (
          await apiClient.get(
            `/reports/sales/by-payment-method?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
            { headers: { Authorization: `Bearer ${session?.accessToken}` } }
          )
        ).data,
      enabled: !!session && !!formattedStartDate && !!formattedEndDate,
    });

  // --- CÁC useQuery MỚI ---
  const { data: staffSalesData, isLoading: isLoadingStaffSales } = useQuery<
    StaffSalesReport[]
  >({
    queryKey: ["staffSales", formattedStartDate, formattedEndDate],
    queryFn: async () =>
      (
        await apiClient.get(
          `/reports/sales/staff?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        )
      ).data,
    enabled: !!session && !!formattedStartDate && !!formattedEndDate,
  });

  const isLoading =
    isLoadingSales ||
    isLoadingProfit ||
    isLoadingStock ||
    isLoadingTopSelling ||
    isLoadingCategorySales ||
    isLoadingPaymentMethods ||
    isLoadingStaffSales;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Tổng quan Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Theo dõi hiệu suất kinh doanh và các chỉ số quan trọng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                    </div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Tổng Doanh thu
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {dateRange?.from &&
                      dateRange?.to &&
                      `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Lợi nhuận gộp
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(totalProfit)}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Tỷ lệ:{" "}
                    {totalRevenue > 0
                      ? ((totalProfit / totalRevenue) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Tổng Đơn hàng
                  </p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {totalOrders.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Trung bình:{" "}
                    {totalOrders > 0 && salesData
                      ? (totalOrders / salesData.length).toFixed(1)
                      : 0}
                    /ngày
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Cảnh báo kho
                  </p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {lowStockCount}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {lowStockCount > 0 ? "Cần nhập hàng" : "Kho đầy đủ"}
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <div className="xl:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="xl:col-span-1">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </>
        ) : (
          <>
            <div className="xl:col-span-2">
              <RevenueChart data={salesData} />
            </div>
            <div className="xl:col-span-1">
              <TopSellingProducts data={topSellingData} />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </>
        ) : (
          <>
            <CategoryPieChart data={categorySalesData} />
            <PaymentMethodPieChart data={paymentMethodData} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {isLoading ? (
          <>
            <div className="xl:col-span-3">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="xl:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </>
        ) : (
          <>
            <div className="xl:col-span-3">
              <StaffSalesReportWidget data={staffSalesData} />
            </div>
            <div className="xl:col-span-2">
              <LowStockWarnings data={lowStockData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
