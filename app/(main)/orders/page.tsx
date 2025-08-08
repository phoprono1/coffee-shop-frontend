// file: app/(main)/orders/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { DonHangResponse } from "@/types/api";
import { OrdersClient } from "./orders-client";

const getOrders = async (
  accessToken: string | undefined
): Promise<DonHangResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/don-hang", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // Sắp xếp các đơn hàng để đơn mới nhất lên đầu
    return response.data.sort(
      (a: DonHangResponse, b: DonHangResponse) =>
        new Date(b.thoiGianTao).getTime() - new Date(a.thoiGianTao).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

const OrdersPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const ordersData = await getOrders(session.accessToken);

  return <OrdersClient data={ordersData} />;
};

export default OrdersPage;
