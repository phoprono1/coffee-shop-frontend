// file: app/(pos)/pos/components/payment-modal.tsx (Nâng cấp cuối cùng)
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCartStore, CartItem } from "@/store/cart-store";
import {
  BanResponse,
  DonHangRequest,
  DonHangResponse,
  KhuyenMaiResponse,
  ThanhToanRequest,
  VnpayPaymentRequest, // Import type mới
  VnpayPaymentResponse, // Import type mới
} from "@/types/api";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  PhuongThucThanhToan,
  PhuongThucThanhToanLabels,
} from "@/constants/enums";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // LẤY DỮ LIỆU TRỰC TIẾP TỪ STORE
  const { items, table, promotion, clearCart } = useCartStore();

  // TÍNH TOÁN TỔNG TIỀN BÊN TRONG MODAL
  const subTotal = items.reduce(
    (acc, item) => acc + item.gia * item.quantity,
    0
  );
  let total = subTotal;
  if (promotion && subTotal >= promotion.giaTriToiThieuApDung) {
    if (promotion.phanTramGiamGia > 0) {
      total = subTotal * (1 - promotion.phanTramGiamGia / 100);
    } else if (promotion.giaTriGiamGiaCoDinh > 0) {
      total = subTotal - promotion.giaTriGiamGiaCoDinh;
    }
  }

  // MUTATION 3: Khởi tạo thanh toán VNPAY
  const initVnpayMutation = useMutation<
    VnpayPaymentResponse,
    Error,
    VnpayPaymentRequest
  >({
    mutationFn: (vnpayRequest) =>
      apiClient
        .post("/thanh-toan/vnpay-qr/init", vnpayRequest, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
        .then((res) => res.data),
    onSuccess: (data) => {
      if (data.vnpayUrl) {
        toast.info("Đang chuyển hướng đến cổng thanh toán VNPay...");
        // Chuyển hướng người dùng đến trang thanh toán
        window.location.href = data.vnpayUrl;
      } else {
        toast.error("Không thể tạo link thanh toán VNPay.");
      }
    },
    onError: (error) => {
      toast.error("Khởi tạo thanh toán VNPay thất bại: " + error.message);
    },
  });

  // MUTATION 2: Xử lý thanh toán thủ công (Tiền mặt, Chuyển khoản...)
  const processManualPaymentMutation = useMutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Error,
    { orderId: number; paymentData: ThanhToanRequest }
  >({
    mutationFn: ({ orderId, paymentData }) =>
      apiClient.post(`/thanh-toan/${orderId}`, paymentData, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      }),
    onSuccess: () => {
      toast.success("Thanh toán thành công!");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      router.refresh();
      onClose();
    },
    onError: (error) => {
      toast.error("Xử lý thanh toán thất bại: " + error.message);
    },
  });

  // MUTATION 1: Tạo đơn hàng
  const createOrderMutation = useMutation<
    DonHangResponse,
    Error,
    { orderPayload: DonHangRequest; paymentMethod: PhuongThucThanhToan }
  >({
    mutationFn: ({ orderPayload }) =>
      apiClient
        .post("/don-hang", orderPayload, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
        .then((res) => res.data),
    onSuccess: (createdOrder, variables) => {
      toast.success(`Đã tạo đơn hàng #${createdOrder.id}.`);

      // PHÂN LUỒNG LOGIC THANH TOÁN
      if (variables.paymentMethod === PhuongThucThanhToan.QR_CODE) {
        // Nếu là QR_CODE, gọi mutation của VNPay
        const vnpayRequest: VnpayPaymentRequest = {
          orderId: createdOrder.id,
          amount: total,
        };
        initVnpayMutation.mutate(vnpayRequest);
      } else {
        // Với các phương thức khác, xử lý như thanh toán thủ công
        const paymentData: ThanhToanRequest = {
          phuongThucThanhToan: variables.paymentMethod,
          soTienThanhToan: total,
        };
        processManualPaymentMutation.mutate({
          orderId: createdOrder.id,
          paymentData,
        });
      }
    },
    onError: (error) => {
      toast.error("Tạo đơn hàng thất bại: " + error.message);
    },
  });

  // Hàm này không đổi
  const handleInitiatePayment = (paymentMethod: PhuongThucThanhToan) => {
    if (!session?.user.id) {
      toast.error("Không tìm thấy thông tin nhân viên.");
      return;
    }
    const orderPayload: DonHangRequest = {
      banId: table?.id || null,
      nhanVienId: session.user.id,
      chiTietDonHangs: items.map((item) => ({
        thucDonId: item.id,
        soLuong: item.quantity,
        ghiChuTuyChinh: item.note || "",
      })),
      khuyenMaiId:
        promotion && subTotal >= promotion.giaTriToiThieuApDung
          ? promotion.id
          : undefined, // Lấy promotion trực tiếp từ store
    };
    createOrderMutation.mutate({ orderPayload, paymentMethod });
  };

  const isLoading =
    createOrderMutation.isPending ||
    processManualPaymentMutation.isPending ||
    initVnpayMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận Thanh toán</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-xl font-bold text-right">
            Tổng cộng: {formatCurrency(total)}
          </div>
          <p>Chọn phương thức thanh toán:</p>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(PhuongThucThanhToan).map((method) => (
              <Button
                key={method}
                variant="outline"
                className="h-16 text-lg"
                disabled={isLoading}
                onClick={() => handleInitiatePayment(method)}
              >
                {PhuongThucThanhToanLabels[method]}
              </Button>
            ))}
          </div>
          {isLoading && (
            <p className="text-center">Đang xử lý, vui lòng chờ...</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
