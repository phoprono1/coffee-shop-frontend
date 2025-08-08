// file: app/(pos)/pos/payment-result/page.tsx (Đã sửa lỗi vòng lặp)
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react"; // 1. Import useRef
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart-store";
import apiClient from "@/lib/axios";
import { useSession } from "next-auth/react";

const PaymentResultPage = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);
  const { data: session } = useSession();

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const [orderInfo, setOrderInfo] = useState("");

  // 2. Tạo một ref để theo dõi xem effect đã chạy hay chưa
  const effectRan = useRef(false);

  const verifyPaymentMutation = useMutation({
    mutationFn: (params: Record<string, string>) =>
      apiClient.post("/thanh-toan/vnpay-return", params, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      }),
    onSuccess: () => {
      setStatus("success");
      setMessage("Thanh toán thành công!");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setStatus("failed");
      setMessage(
        error.response?.data?.message || "Xác thực thanh toán thất bại."
      );
    },
  });

  useEffect(() => {
    // 3. Thêm điều kiện kiểm tra ref
    if (session && !effectRan.current) {
      const responseCode = searchParams.get("vnp_ResponseCode");
      const orderInfoParam = searchParams.get("vnp_OrderInfo");

      if (orderInfoParam) {
        setOrderInfo(decodeURIComponent(orderInfoParam));
      }

      if (responseCode === "00") {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        verifyPaymentMutation.mutate(params);
      } else {
        setStatus("failed");
        setMessage("Giao dịch đã bị hủy hoặc thất bại.");
      }

      // 4. Đánh dấu là effect đã chạy
      effectRan.current = true;
    }
  }, [session, searchParams, verifyPaymentMutation]); // Giữ nguyên dependency array

  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {status === "loading" && (
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          )}
          {status === "success" && (
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          )}
          {status === "failed" && (
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
          )}
          <CardTitle className="text-2xl mt-4">{message}</CardTitle>
          {orderInfo && <CardDescription>{orderInfo}</CardDescription>}
        </CardHeader>
        <CardContent>
          {status !== "loading" && (
            <Link href="/pos">
              <Button>Quay lại Màn hình Bán hàng</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResultPage;
