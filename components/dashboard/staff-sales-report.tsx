// file: components/dashboard/staff-sales-report.tsx (Đã sửa)
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StaffSalesReport } from "@/types/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Bỏ AvatarImage không dùng

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

interface StaffSalesReportProps {
  data?: StaffSalesReport[];
}

// ĐỔI TÊN COMPONENT Ở ĐÂY
export const StaffSalesReportWidget = ({ data }: StaffSalesReportProps) => {
  return (
    <Card className="col-span-12 md:col-span-7">
      <CardHeader>
        <CardTitle>Hiệu suất Nhân viên</CardTitle>
        <CardDescription>
          Tổng doanh thu và số đơn hàng được tạo bởi mỗi nhân viên.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data?.map((staff) => (
            <div key={staff.nhanVienId} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{staff.tenNhanVien.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {staff.tenNhanVien}
                </p>
                <p className="text-sm text-muted-foreground">{staff.chucVu}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-medium">
                  {formatCurrency(staff.tongDoanhThuTaoDon)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {staff.soLuongDonHangTao} đơn hàng
                </p>
              </div>
            </div>
          ))}
          {data?.length === 0 && (
            <p className="text-sm text-muted-foreground">Không có dữ liệu.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
