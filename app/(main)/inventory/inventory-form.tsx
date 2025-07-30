// file: app/(main)/inventory/inventory-form.tsx (Phiên bản đã sửa)
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
  DialogDescription,
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
import { NguyenVatLieuRequest, NguyenVatLieuResponse } from "@/types/api";
import apiClient from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { units } from "@/constants/units";

// BƯỚC 1: CẬP NHẬT SCHEMA CHO NGUYÊN VẬT LIỆU
const formInputSchema = z.object({
  tenNguyenLieu: z.string().min(1, "Tên không được để trống"),
  donViTinh: z.string().min(1, "Đơn vị tính không được để trống"),
  soLuongTonHienTai: z.string(), // Để string cho form, sẽ transform sau
  mucCanhBaoTonKho: z.string(), // Để string cho form, sẽ transform sau
});

// BƯỚC 2: CẬP NHẬT SCHEMA BIẾN ĐỔI
const apiSchema = formInputSchema.transform((data) => ({
  ...data,
  soLuongTonHienTai: Number(data.soLuongTonHienTai) || 0,
  mucCanhBaoTonKho: Number(data.mucCanhBaoTonKho) || 0,
}));

type FormValues = z.infer<typeof formInputSchema>;

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: NguyenVatLieuResponse | null;
}

export const InventoryForm = ({
  isOpen,
  onClose,
  initialData,
}: InventoryFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  // BƯỚC 3: CẬP NHẬT CÁC TEXT VÀ LOGIC
  const title = initialData
    ? "Sửa nguyên vật liệu"
    : "Thêm nguyên vật liệu mới";
  const description = initialData
    ? "Chỉnh sửa thông tin nguyên vật liệu trong kho."
    : "Thêm một nguyên vật liệu mới vào hệ thống.";
  const toastMessage = initialData
    ? "Nguyên vật liệu đã được cập nhật."
    : "Nguyên vật liệu đã được tạo.";
  const action = initialData ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<FormValues>({
    resolver: zodResolver(formInputSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          soLuongTonHienTai: String(initialData.soLuongTonHienTai),
          mucCanhBaoTonKho: String(initialData.mucCanhBaoTonKho),
        }
      : {
          tenNguyenLieu: "",
          donViTinh: "GRAM",
          soLuongTonHienTai: "0",
          mucCanhBaoTonKho: "0",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        soLuongTonHienTai: String(initialData.soLuongTonHienTai),
        mucCanhBaoTonKho: String(initialData.mucCanhBaoTonKho),
      });
    }
  }, [initialData, form.reset, form]);

  const mutation = useMutation<
    NguyenVatLieuResponse,
    Error,
    NguyenVatLieuRequest
  >({
    mutationFn: async (data) => {
      if (initialData) {
        // Cập nhật endpoint
        const response = await apiClient.put(
          `/nguyen-vat-lieu/${initialData.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${session?.accessToken}` },
          }
        );
        return response.data;
      } else {
        // Cập nhật endpoint
        const response = await apiClient.post("/nguyen-vat-lieu", data, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        });
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.refresh();
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error("Đã có lỗi xảy ra: " + error.message);
    },
  });

  const onSubmit = (values: FormValues) => {
    const parsedValues = apiSchema.parse(values);
    mutation.mutate(parsedValues);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* BƯỚC 4: CẬP NHẬT CÁC FORMFIELD */}
            <FormField
              control={form.control}
              name="tenNguyenLieu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Nguyên Vật Liệu</FormLabel>
                  <FormControl>
                    <Input placeholder="Hạt cà phê Arabica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="donViTinh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị tính</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị tính..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
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
              name="soLuongTonHienTai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng tồn</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mucCanhBaoTonKho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức cảnh báo tồn</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      {...field}
                    />
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
