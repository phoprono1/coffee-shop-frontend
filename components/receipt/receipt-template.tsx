// file: components/receipt/receipt-template.tsx
"use client";

import { DonHangResponse } from "@/types/api";
import { format } from "date-fns";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

interface ReceiptTemplateProps {
  order: DonHangResponse;
}

export const ReceiptTemplate = ({ order }: ReceiptTemplateProps) => {
  return (
    <div className="bg-white text-black font-mono text-sm p-4 w-[300px]">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">CAFE HOANG PHO</h2>
        <p>Địa chỉ: 123 ABC, Quận XYZ, TP. Đà Nẵng</p>
        <p>Hotline: 0987.654.321</p>
        <h3 className="text-xl font-bold mt-2">HÓA ĐƠN BÁN HÀNG</h3>
      </div>

      <div className="border-t border-b border-dashed border-black py-2 mb-2">
        <p>Số HĐ: HD{String(order.id).padStart(6, "0")}</p>
        <p>Ngày: {format(new Date(order.thoiGianTao), "dd/MM/yyyy HH:mm")}</p>
        <p>Nhân viên: {order.nhanVienTao.ten}</p>
        <p>Bàn: {order.ban?.soBan || "Mang đi"}</p>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Tên món</th>
            <th className="text-center">SL</th>
            <th className="text-right">Đ.Giá</th>
            <th className="text-right">T.Tiền</th>
          </tr>
        </thead>
        <tbody className="border-t border-b border-dashed border-black">
          {order.chiTietDonHangs.map((item) => (
            <tr key={item.id}>
              <td className="py-1">{item.thucDon.tenMon}</td>
              <td className="text-center">{item.soLuong}</td>
              <td className="text-right">{item.giaBanTaiThoiDiem / 1000}K</td>
              <td className="text-right">
                {(item.soLuong * item.giaBanTaiThoiDiem) / 1000}K
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 space-y-1">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>{formatCurrency(order.tongTienTruocKhuyenMai)}</span>
        </div>
        {order.khuyenMai && (
          <div className="flex justify-between">
            <span>Giảm giá:</span>
            <span>
              -
              {formatCurrency(
                order.tongTienTruocKhuyenMai - order.tongTienThanhToan
              )}
            </span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base">
          <span>TỔNG CỘNG:</span>
          <span>{formatCurrency(order.tongTienThanhToan)}</span>
        </div>
      </div>

      <div className="text-center mt-4 border-t border-dashed border-black pt-2">
        <p>Cảm ơn quý khách!</p>
      </div>
    </div>
  );
};
