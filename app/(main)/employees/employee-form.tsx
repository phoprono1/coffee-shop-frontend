// file: app/(main)/employees/employee-form.tsx (Đã sửa lỗi logic transform)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { NhanVienRequest, NhanVienResponse } from "@/types/api";
import apiClient from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roles } from "@/constants/roles";

// Schema này sẽ thay đổi tùy thuộc vào việc Thêm hay Sửa
const createFormSchema = (isEditing: boolean) =>
  z.object({
    ten: z.string().min(1, "Tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    sdt: z.string().optional(),
    chucVu: z.string().min(1, "Vui lòng chọn chức vụ"),
    ngayVaoLam: z.string().min(1, "Vui lòng chọn ngày vào làm"),
    luongCoBan: z.string().min(1, "Lương không được để trống"),
    // Mật khẩu không bắt buộc khi sửa, nhưng bắt buộc khi tạo mới
    matKhau: isEditing
      ? z.string().optional()
      : z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  });

// SỬA LỖI Ở ĐÂY: Dùng `formInputSchema.transform` thay vì z.object({}).transform
const createApiSchema = (isEditing: boolean) =>
  createFormSchema(isEditing).transform((data) => ({
    ...data,
    luongCoBan: Number(data.luongCoBan),
  }));

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: NhanVienResponse | null;
}

export const EmployeeForm = ({
  isOpen,
  onClose,
  initialData,
}: EmployeeFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isEditing = !!initialData;

  const title = isEditing ? "Sửa nhân viên" : "Thêm nhân viên mới";
  const toastMessage = isEditing
    ? "Nhân viên đã được cập nhật."
    : "Nhân viên đã được tạo.";
  const action = isEditing ? "Lưu thay đổi" : "Tạo mới";

  // Tạo schema động dựa trên ngữ cảnh
  const formSchema = createFormSchema(isEditing);
  const apiSchema = createApiSchema(isEditing);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          luongCoBan: String(initialData.luongCoBan),
          matKhau: "",
        }
      : {
          ten: "",
          email: "",
          sdt: "",
          chucVu: "PHUC_VU",
          ngayVaoLam: "",
          luongCoBan: "0",
          matKhau: "",
        },
  });

  useEffect(() => {
    // Reset form khi initialData thay đổi (ví dụ: mở lại dialog để sửa nhân viên khác)
    if (initialData) {
      form.reset({
        ...initialData,
        luongCoBan: String(initialData.luongCoBan),
        matKhau: "",
      });
    } else {
      form.reset({
        ten: "",
        email: "",
        sdt: "",
        chucVu: "PHUC_VU",
        ngayVaoLam: "",
        luongCoBan: "0",
        matKhau: "",
      });
    }
  }, [initialData, form]);

  const mutation = useMutation<NhanVienResponse, Error, NhanVienRequest>({
    mutationFn: async (data) => {
      if (isEditing && initialData) {
        if (!data.matKhau || data.matKhau.trim() === "") {
          delete data.matKhau;
        }
        const response = await apiClient.put(
          `/nhan-vien/${initialData.id}`,
          data,
          { headers: { Authorization: `Bearer ${session?.accessToken}` } }
        );
        return response.data;
      } else {
        const response = await apiClient.post("/nhan-vien", data, {
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho nhân viên.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="ten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
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
              name="sdt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SĐT</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chucVu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chức vụ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
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
              name="ngayVaoLam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày vào làm</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="luongCoBan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lương cơ bản</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matKhau"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mật khẩu {isEditing && "(Để trống nếu không đổi)"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-2">
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
