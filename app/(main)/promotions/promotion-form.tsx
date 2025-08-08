// file: app/(main)/promotions/promotion-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { KhuyenMaiRequest, KhuyenMaiResponse } from "@/types/api";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Updated Zod schema
const formSchema = z
  .object({
    tenKhuyenMai: z.string().min(1, "Tên không được để trống"),
    moTa: z.string().optional(),
    phanTramGiamGia: z.number().min(0, "Không âm").optional(),
    giaTriGiamGiaCoDinh: z.number().min(0, "Không âm").optional(),
    giaTriToiThieuApDung: z.number().min(0, "Không âm"),
    ngayBatDau: z
      .date()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Vui lòng chọn ngày bắt đầu.",
      }),
    ngayKetThuc: z
      .date()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Vui lòng chọn ngày kết thúc.",
      }),
    trangThaiKichHoat: z.boolean(), // Removed .default(false) to ensure strict boolean
  })
  .refine(
    (data) => {
      // Chỉ cho phép một trong hai loại giảm giá
      return !(
        data.phanTramGiamGia &&
        data.phanTramGiamGia > 0 &&
        data.giaTriGiamGiaCoDinh &&
        data.giaTriGiamGiaCoDinh > 0
      );
    },
    {
      message:
        "Chỉ chọn giảm giá theo % hoặc giá trị cố định, không chọn cả hai.",
      path: ["phanTramGiamGia"],
    }
  )
  .refine((data) => data.ngayKetThuc >= data.ngayBatDau, {
    message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.",
    path: ["ngayKetThuc"],
  });

type FormValues = z.infer<typeof formSchema>;

interface PromotionFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: KhuyenMaiResponse | null;
}

export const PromotionForm = ({
  isOpen,
  onClose,
  initialData,
}: PromotionFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isEditing = !!initialData;

  const title = isEditing ? "Sửa khuyến mãi" : "Tạo khuyến mãi mới";
  const toastMessage = isEditing
    ? "Khuyến mãi đã được cập nhật."
    : "Khuyến mãi đã được tạo.";
  const action = isEditing ? "Lưu thay đổi" : "Tạo mới";

  // Explicitly type the useForm hook with FormValues
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          phanTramGiamGia: initialData.phanTramGiamGia || 0,
          giaTriGiamGiaCoDinh: initialData.giaTriGiamGiaCoDinh || 0,
          giaTriToiThieuApDung: initialData.giaTriToiThieuApDung || 0,
          ngayBatDau: new Date(initialData.ngayBatDau),
          ngayKetThuc: new Date(initialData.ngayKetThuc),
          trangThaiKichHoat: initialData.trangThaiKichHoat ?? false, // Ensure boolean
        }
      : {
          tenKhuyenMai: "",
          moTa: "",
          phanTramGiamGia: 0,
          giaTriGiamGiaCoDinh: 0,
          giaTriToiThieuApDung: 0,
          ngayBatDau: new Date(), // Provide default date
          ngayKetThuc: new Date(), // Provide default date
          trangThaiKichHoat: true, // Explicit boolean default
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        phanTramGiamGia: initialData.phanTramGiamGia || 0,
        giaTriGiamGiaCoDinh: initialData.giaTriGiamGiaCoDinh || 0,
        giaTriToiThieuApDung: initialData.giaTriToiThieuApDung || 0,
        ngayBatDau: new Date(initialData.ngayBatDau),
        ngayKetThuc: new Date(initialData.ngayKetThuc),
        trangThaiKichHoat: initialData.trangThaiKichHoat ?? false, // Ensure boolean
      });
    }
  }, [initialData, form]);

  const mutation = useMutation<KhuyenMaiResponse, Error, FormValues>({
    // Sửa type ở đây
    mutationFn: async (data) => {
      // SỬA LỖI LOGIC Ở ĐÂY
      const payload: KhuyenMaiRequest = {
        tenKhuyenMai: data.tenKhuyenMai,
        moTa: data.moTa,
        giaTriToiThieuApDung: data.giaTriToiThieuApDung,
        ngayBatDau: format(data.ngayBatDau, "yyyy-MM-dd"),
        ngayKetThuc: format(data.ngayKetThuc, "yyyy-MM-dd"),
        trangThaiKichHoat: data.trangThaiKichHoat,
      };

      // Chỉ thêm một trong hai trường giảm giá vào payload
      if (data.phanTramGiamGia && data.phanTramGiamGia > 0) {
        payload.phanTramGiamGia = data.phanTramGiamGia;
      } else if (data.giaTriGiamGiaCoDinh && data.giaTriGiamGiaCoDinh > 0) {
        payload.giaTriGiamGiaCoDinh = data.giaTriGiamGiaCoDinh;
      }
      // Nếu cả hai đều là 0 hoặc không có, không gửi trường nào cả (tùy thuộc vào yêu cầu của BE)
      // Nếu BE yêu cầu ít nhất một trường phải có, bạn có thể thêm logic kiểm tra ở đây.

      if (isEditing && initialData) {
        const response = await apiClient.put(
          `/khuyen-mai/${initialData.id}`,
          payload,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        );
        return response.data;
      } else {
        const response = await apiClient.post("/khuyen-mai", payload, {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra."),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenKhuyenMai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khuyến mãi</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moTa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phanTramGiamGia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="giaTriGiamGiaCoDinh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="giaTriToiThieuApDung"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn hàng tối thiểu để áp dụng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ngayBatDau"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ngayKetThuc"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="trangThaiKichHoat"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Kích hoạt khuyến mãi</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
