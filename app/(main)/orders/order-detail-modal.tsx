// file: app/(main)/orders/order-detail-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DonHangResponse } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TrangThaiDonHangLabels } from "@/constants/enums";
import ReactDOMServer from "react-dom/server";
import { ReceiptTemplate } from "@/components/receipt/receipt-template";
import { Button } from "@/components/ui/button";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DonHangResponse | null;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
}: OrderDetailModalProps) => {
  if (!order) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      // Chuyển component React thành chuỗi HTML
      const receiptHtml = ReactDOMServer.renderToString(
        <ReceiptTemplate order={order} />
      );

      printWindow.document.write("<html><head><title>Hóa đơn</title>");
      // Thêm CSS để in đẹp hơn
      printWindow.document.write(
        "<style>@media print { body { -webkit-print-color-adjust: exact; } @page { size: 80mm auto; margin: 0; } }</style>"
      );
      printWindow.document.write("</head><body>");
      printWindow.document.write(receiptHtml);
      printWindow.document.write("</body></html>");

      printWindow.document.close();
      printWindow.focus(); // Cần thiết cho một số trình duyệt

      // Chờ cho nội dung load xong rồi mới in
      printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  const trangThaiDonHangLabel =
    TrangThaiDonHangLabels[order.trangThaiDonHang] || "Không xác định";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết Đơn hàng #{order.id}</DialogTitle>
          <DialogDescription>
            Thời gian tạo:{" "}
            {format(new Date(order.thoiGianTao), "dd/MM/yyyy HH:mm:ss")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Nhân viên:</strong> {order.nhanVienTao.ten}
          </div>
          <div>
            <strong>Bàn:</strong> {order.ban ? order.ban.soBan : "Mang đi"}
          </div>
          <div>
            <strong>Trạng thái:</strong> <Badge>{trangThaiDonHangLabel}</Badge>
          </div>
        </div>
        <hr />
        <h4 className="font-medium">Chi tiết các món:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên món</TableHead>
              <TableHead>SL</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.chiTietDonHangs.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.thucDon.tenMon}</TableCell>
                <TableCell>{item.soLuong}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.giaBanTaiThoiDiem)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.soLuong * item.giaBanTaiThoiDiem)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="space-y-2 text-right">
          <div>
            Tổng tiền hàng: {formatCurrency(order.tongTienTruocKhuyenMai)}
          </div>
          {order.khuyenMai && (
            <div className="text-red-500">
              Khuyến mãi ({order.khuyenMai.tenKhuyenMai}): -
              {formatCurrency(
                order.tongTienTruocKhuyenMai - order.tongTienThanhToan
              )}
            </div>
          )}
          <div className="text-lg font-bold">
            Tổng thanh toán: {formatCurrency(order.tongTienThanhToan)}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePrint}>In Hóa đơn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
