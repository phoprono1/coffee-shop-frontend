// file: app/(main)/receipts/receipt-detail-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhieuNhapKhoResponse } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface ReceiptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: PhieuNhapKhoResponse | null;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const ReceiptDetailModal = ({
  isOpen,
  onClose,
  receipt,
}: ReceiptDetailModalProps) => {
  if (!receipt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết Phiếu nhập #{receipt.id}</DialogTitle>
          <DialogDescription>
            Ngày nhập: {format(new Date(receipt.ngayNhap), "dd/MM/yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Nhà cung cấp:</strong> {receipt.nhaCungCap.tenNhaCungCap}
          </div>
          <div>
            <strong>Nhân viên nhập:</strong> {receipt.nhanVienNhap.ten}
          </div>
          {receipt.ghiChu && (
            <div>
              <strong>Ghi chú:</strong> {receipt.ghiChu}
            </div>
          )}
        </div>
        <hr />
        <h4 className="font-medium">Các nguyên vật liệu đã nhập:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Nguyên Vật Liệu</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipt.chiTietPhieuNhapKhos.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nguyenVatLieu.tenNguyenLieu}</TableCell>
                <TableCell className="text-right">
                  {item.soLuongNhap} {item.nguyenVatLieu.donViTinh}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.donGiaNhap)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.soLuongNhap * item.donGiaNhap)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="text-right font-bold text-lg">
          Tổng cộng: {formatCurrency(receipt.tongTienNhap)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
