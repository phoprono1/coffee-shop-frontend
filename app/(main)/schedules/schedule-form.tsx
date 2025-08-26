// file: app/(main)/schedules/schedule-form.tsx (Phiên bản cuối cùng)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  LichLamViecRequest,
  LichLamViecResponse,
  NhanVienResponse,
  CaLamViecResponse,
} from "@/types/api";
import apiClient from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  TrangThaiLichLamViec,
  TrangThaiLichLamViecLabels,
} from "@/constants/enums";
import { Badge } from "@/components/ui/badge"; // Sửa lại import Badge

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Partial<LichLamViecResponse> | null;
  selectedDate: string | null;
  employees: NhanVienResponse[];
  shifts: CaLamViecResponse[];
}

export const ScheduleForm = ({
  isOpen,
  onClose,
  initialData,
  selectedDate,
  employees,
  shifts,
}: ScheduleFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isEditing = !!initialData;
  const isManager = session?.user?.role === "QUAN_LY";

  // Tạo schema động dựa trên vai trò
  const formSchema = z.object({
    nhanVienId: isManager
      ? z.string().min(1, "Vui lòng chọn nhân viên")
      : z.string().optional(),
    caLamViecId: z.string().min(1, "Vui lòng chọn ca làm việc"),
    ghiChu: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const title = isManager
    ? isEditing
      ? "Sửa Lịch Làm Việc"
      : "Phân Công Ca Mới"
    : "Đăng ký ca làm việc";
  const toastMessage = isEditing
    ? "Lịch đã được cập nhật."
    : "Yêu cầu đã được gửi đi.";
  const action = isEditing ? "Lưu thay đổi" : "Gửi yêu cầu";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nhanVienId: String(initialData.nhanVien?.id),
        caLamViecId: String(initialData.caLamViec?.id),
        ghiChu: initialData.ghiChu || "",
      });
    } else {
      form.reset({
        nhanVienId: isManager ? "" : undefined,
        caLamViecId: "",
        ghiChu: "",
      });
    }
  }, [initialData, form, isManager]);

  const mutation = useMutation<LichLamViecResponse, Error, LichLamViecRequest>({
    mutationFn: async (data) => {
      if (isEditing && initialData?.id) {
        const response = await apiClient.put(
          `/lich-lam-viec/${initialData.id}`,
          data,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        );
        return response.data;
      } else {
        const response = await apiClient.post("/lich-lam-viec/register", data, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        });
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.refresh();
      onClose();
    },
    onError: (error) => toast.error("Đã có lỗi xảy ra: " + error.message),
  });

  const statusMutation = useMutation<
    LichLamViecResponse,
    Error,
    { status: TrangThaiLichLamViec }
  >({
    mutationFn: async ({ status }) => {
      const response = await apiClient.patch(
        `/lich-lam-viec/${initialData!.id}/status?status=${status}`,
        {},
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      router.refresh();
      onClose();
    },
    onError: (error) => toast.error("Lỗi: " + error.message),
  });

  const handleStatusUpdate = (status: TrangThaiLichLamViec) => {
    statusMutation.mutate({ status });
  };

  const onSubmit = (values: FormValues) => {
    const dateString = initialData?.ngay || selectedDate!;
    const formattedDate = format(parseISO(dateString), "yyyy-MM-dd");

    const payload: LichLamViecRequest = {
      nhanVienId: isManager ? Number(values.nhanVienId) : session!.user!.id!,
      caLamViecId: Number(values.caLamViecId),
      ngay: formattedDate,
      ghiChu: values.ghiChu || "",
      trangThai: isManager ? "DUYET" : "DANG_KY",
    };

    if (isEditing && initialData?.trangThai) {
      payload.trangThai = initialData.trangThai;
    }

    mutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isEditing && (
          <p className="text-sm text-muted-foreground">
            Ngày: {format(new Date(initialData!.ngay!), "dd/MM/yyyy")}
          </p>
        )}
        {isEditing && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Trạng thái:</span>
            <Badge>
              {
                TrangThaiLichLamViecLabels[
                  initialData.trangThai as TrangThaiLichLamViec
                ]
              }
            </Badge>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isManager && (
              <FormField
                control={form.control}
                name="nhanVienId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhân viên</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhân viên..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={String(e.id)}>
                            {e.ten}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="caLamViecId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ca làm việc</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ca làm việc..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shifts.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.tenCa} ({s.gioBatDau} - {s.gioKetThuc})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ghiChu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-between">
              {isEditing &&
                initialData?.trangThai === TrangThaiLichLamViec.DANG_KY && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        handleStatusUpdate(TrangThaiLichLamViec.TU_CHOI)
                      }
                    >
                      Từ chối
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(TrangThaiLichLamViec.DUYET)
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Duyệt
                    </Button>
                  </div>
                )}
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Hủy
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Đang xử lý..." : action}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
