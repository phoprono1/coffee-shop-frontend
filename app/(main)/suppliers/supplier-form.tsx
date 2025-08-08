// file: app/(main)/suppliers/supplier-form.tsx
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
import { NhaCungCapRequest, NhaCungCapResponse } from "@/types/api";
import apiClient from "@/lib/axios";

const formSchema = z.object({
  tenNhaCungCap: z.string().min(1, "Tên không được để trống"),
  diaChi: z.string().min(1, "Địa chỉ không được để trống"),
  soDienThoai: z.string().min(1, "Số điện thoại không được để trống"),
  email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof formSchema>;

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: NhaCungCapResponse | null;
}

export const SupplierForm = ({
  isOpen,
  onClose,
  initialData,
}: SupplierFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isEditing = !!initialData;

  const title = isEditing ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp mới";
  const toastMessage = isEditing
    ? "Nhà cung cấp đã được cập nhật."
    : "Nhà cung cấp đã được tạo.";
  const action = isEditing ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      tenNhaCungCap: "",
      diaChi: "",
      soDienThoai: "",
      email: "",
    },
  });

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [initialData, form]);

  const mutation = useMutation<NhaCungCapResponse, Error, NhaCungCapRequest>({
    mutationFn: async (data) => {
      if (isEditing && initialData) {
        const response = await apiClient.put(
          `/nha-cung-cap/${initialData.id}`,
          data,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        );
        return response.data;
      } else {
        const response = await apiClient.post("/nha-cung-cap", data, {
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

  const onSubmit = (values: FormValues) => mutation.mutate(values);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenNhaCungCap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhà cung cấp</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soDienThoai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diaChi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
