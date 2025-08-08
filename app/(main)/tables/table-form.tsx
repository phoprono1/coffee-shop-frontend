// file: app/(main)/tables/table-form.tsx
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
import { BanRequest, BanResponse } from "@/types/api";
import apiClient from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@/constants/locations";

const formInputSchema = z.object({
  viTri: z.string().min(1, "Vị trí không được để trống"),
  sucChua: z
    .string()
    .refine((val) => Number(val) > 0, { message: "Sức chứa phải lớn hơn 0" }),
});

const apiSchema = formInputSchema.transform((data) => ({
  ...data,
  sucChua: Number(data.sucChua),
}));

type FormValues = z.infer<typeof formInputSchema>;

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: BanResponse | null;
}

export const TableForm = ({ isOpen, onClose, initialData }: TableFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isEditing = !!initialData;

  const title = isEditing ? "Sửa thông tin bàn" : "Thêm bàn mới";
  const toastMessage = isEditing ? "Bàn đã được cập nhật." : "Bàn đã được tạo.";
  const action = isEditing ? "Lưu thay đổi" : "Tạo mới";

  const form = useForm<FormValues>({
    resolver: zodResolver(formInputSchema),
    // 2. CẬP NHẬT GIÁ TRỊ MẶC ĐỊNH
    defaultValues: initialData
      ? { ...initialData, sucChua: String(initialData.sucChua) }
      : { viTri: "TANG_1", sucChua: "4" }, // Đặt một giá trị mặc định hợp lệ
  });

  useEffect(() => {
    if (initialData)
      form.reset({ ...initialData, sucChua: String(initialData.sucChua) });
  }, [initialData, form]);

  const mutation = useMutation<BanResponse, Error, BanRequest>({
    mutationFn: async (data) => {
      if (isEditing && initialData) {
        const response = await apiClient.put(`/ban/${initialData.id}`, data, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        });
        return response.data;
      } else {
        const response = await apiClient.post("/ban", data, {
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
    const parsedValues = apiSchema.parse(values);
    mutation.mutate(parsedValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="viTri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vị trí..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
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
              name="sucChua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sức chứa (người)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
