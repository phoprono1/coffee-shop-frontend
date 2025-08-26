"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChamCongResponse } from "@/types/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { format, isToday } from "date-fns";

interface TimekeepingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Hàm để lấy bản ghi chấm công gần nhất của nhân viên
const fetchLatestAttendance = async (
  nhanVienId: number,
  accessToken: string
) => {
  const { data } = await apiClient.get<ChamCongResponse | null>(
    `/cham-cong/latest-today/${nhanVienId}`, // <-- GỌI ENDPOINT MỚI
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return data;
};

export const TimekeepingModal = ({
  isOpen,
  onClose,
}: TimekeepingModalProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient(); // <-- Chúng ta sẽ dùng lại queryClient
  const nhanVienId = session?.user?.id;

  const {
    data: latestAttendance,
    isLoading,
    isError,
  } = useQuery<ChamCongResponse | null>({
    queryKey: ["latestAttendance", nhanVienId],
    queryFn: () => fetchLatestAttendance(nhanVienId!, session!.accessToken!),
    enabled: !!nhanVienId && !!session?.accessToken,
  });

  // SỬA LẠI CÁC MUTATION ĐỂ CẬP NHẬT CACHE
  const checkInMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(
          "/cham-cong/check-in",
          { nhanVienId },
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        )
        .then((res) => res.data), // Trả về dữ liệu chấm công mới
    onSuccess: (newAttendanceRecord) => {
      toast.success("Check-in thành công!");
      // CẬP NHẬT CACHE MỘT CÁCH TƯỜNG MINH
      queryClient.setQueryData(
        ["latestAttendance", nhanVienId],
        newAttendanceRecord
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Check-in thất bại."),
  });

  const checkOutMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(
          `/cham-cong/check-out/${nhanVienId}`,
          {},
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        )
        .then((res) => res.data), // Trả về dữ liệu chấm công đã cập nhật
    onSuccess: (updatedAttendanceRecord) => {
      toast.success("Check-out thành công!");
      // CẬP NHẬT CACHE MỘT CÁCH TƯỜNG MINH
      queryClient.setQueryData(
        ["latestAttendance", nhanVienId],
        updatedAttendanceRecord
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Check-out thất bại."),
  });

  // Logic xác định trạng thái không đổi
  const hasCheckedInToday =
    latestAttendance &&
    latestAttendance.thoiGianVao &&
    !latestAttendance.thoiGianRa;

  // Logic hiển thị giờ check-in an toàn hơn
  const checkInTime = hasCheckedInToday
    ? format(new Date(latestAttendance.thoiGianVao!), "HH:mm:ss dd/MM/yyyy")
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chấm Công</DialogTitle>
          <DialogDescription>
            Thực hiện check-in hoặc check-out cho ca làm việc của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-center space-y-4">
          {isLoading && <Loader2 className="h-8 w-8 mx-auto animate-spin" />}
          {isError && (
            <p className="text-red-500">Không thể tải trạng thái chấm công.</p>
          )}

          {!isLoading && !isError && (
            <>
              {hasCheckedInToday ? (
                <div>
                  <p>Bạn đã check-in lúc:</p>
                  <p className="text-2xl font-bold text-green-600">
                    {checkInTime}
                  </p>
                </div>
              ) : (
                <div>
                  {/* Hiển thị thông báo nếu đã check-out */}
                  {latestAttendance?.thoiGianRa ? (
                    <p>Bạn đã check-out thành công hôm nay.</p>
                  ) : (
                    <>
                      <p>Hôm nay bạn chưa check-in.</p>
                      <p className="text-sm text-muted-foreground">
                        Sẵn sàng để bắt đầu ca làm việc?
                      </p>
                    </>
                  )}
                </div>
              )}

              {hasCheckedInToday ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => checkOutMutation.mutate()}
                  disabled={checkOutMutation.isPending}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  {checkOutMutation.isPending ? "Đang xử lý..." : "Check-out"}
                </Button>
              ) : (
                // Ẩn nút check-in nếu đã check-out xong trong ngày
                !latestAttendance?.thoiGianRa && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => checkInMutation.mutate()}
                    disabled={checkInMutation.isPending}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    {checkInMutation.isPending ? "Đang xử lý..." : "Check-in"}
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
