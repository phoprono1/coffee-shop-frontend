// file: app/(main)/shifts/shift-form.tsx (Phiên bản đã sửa và cải tiến)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CaLamViecRequest, CaLamViecResponse } from "@/types/api"; // Sửa lại import
import apiClient from "@/lib/axios";

// Schema được cập nhật để làm việc với chuỗi HH:mm
const formSchema = z.object({
  tenCa: z.string().min(1, "Tên ca không được để trống"),
  // Dùng regex để validate định dạng HH:mm
  gioBatDau: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Giờ không hợp lệ (HH:mm)"),
  gioKetThuc: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Giờ không hợp lệ (HH:mm)"),
});

type FormValues = z.infer<typeof formSchema>;

interface ShiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CaLamViecResponse | null;
}

// Hàm helper để chuyển "HH:mm:ss" thành "HH:mm"
const formatTimeToHHmm = (timeStr: string | undefined) => {
  if (!timeStr) return "";
  return timeStr.substring(0, 5);
};

export const ShiftForm = ({ isOpen, onClose, initialData }: ShiftFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isEditing = !!initialData;

  const title = isEditing ? "Sửa ca làm việc" : "Thêm ca làm việc mới";
  const toastMessage = isEditing
    ? "Ca làm việc đã được cập nhật."
    : "Ca làm việc đã được tạo.";
  const action = isEditing ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          tenCa: initialData.tenCa,
          gioBatDau: formatTimeToHHmm(initialData.gioBatDau),
          gioKetThuc: formatTimeToHHmm(initialData.gioKetThuc),
        }
      : { tenCa: "", gioBatDau: "07:00", gioKetThuc: "15:00" },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        tenCa: initialData.tenCa,
        gioBatDau: formatTimeToHHmm(initialData.gioBatDau),
        gioKetThuc: formatTimeToHHmm(initialData.gioKetThuc),
      });
    } else {
      form.reset({ tenCa: "", gioBatDau: "07:00", gioKetThuc: "15:00" });
    }
  }, [initialData, form]);

  // Sửa lại kiểu dữ liệu của mutation
  const mutation = useMutation<CaLamViecResponse, Error, CaLamViecRequest>({
    mutationFn: async (data) => {
      if (isEditing && initialData) {
        const response = await apiClient.put(
          `/ca-lam-viec/${initialData.id}`,
          data,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        );
        return response.data;
      } else {
        const response = await apiClient.post("/ca-lam-viec", data, {
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

  const onSubmit = (values: FormValues) => {
    // Payload gửi đi khớp với CaLamViecRequest
    const payload: CaLamViecRequest = {
      tenCa: values.tenCa,
      gioBatDau: `${values.gioBatDau}`,
      gioKetThuc: `${values.gioKetThuc}`,
    };
    mutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenCa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên ca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ca sáng, ca tối..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gioBatDau"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ bắt đầu</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gioKetThuc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ kết thúc</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Đang xử lý..." : action}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
