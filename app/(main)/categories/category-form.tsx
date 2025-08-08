// file: app/(main)/categories/category-form.tsx
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
import { DanhMucRequest, DanhMucResponse } from "@/types/api";
import apiClient from "@/lib/axios";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  tenDanhMuc: z.string().min(1, "Tên danh mục không được để trống"),
  moTa: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: DanhMucResponse | null;
}

export const CategoryForm = ({
  isOpen,
  onClose,
  initialData,
}: CategoryFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isEditing = !!initialData;

  const title = isEditing ? "Sửa danh mục" : "Thêm danh mục mới";
  const toastMessage = isEditing
    ? "Danh mục đã được cập nhật."
    : "Danh mục đã được tạo.";
  const action = isEditing ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { tenDanhMuc: "", moTa: "" },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ tenDanhMuc: "", moTa: "" });
    }
  }, [initialData, form]);

  const mutation = useMutation<DanhMucResponse, Error, DanhMucRequest>({
    mutationFn: async (data) => {
      if (isEditing && initialData) {
        const response = await apiClient.put(
          `/danh-muc/${initialData.id}`,
          data,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        );
        return response.data;
      } else {
        const response = await apiClient.post("/danh-muc", data, {
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenDanhMuc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Cà phê, Trà sữa..." {...field} />
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
                  <FormLabel>Mô tả (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về danh mục..."
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
