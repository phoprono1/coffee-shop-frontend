// file: app/(main)/menu/add-menu-form.tsx (Phiên bản cuối cùng, Type-safe tuyệt đối)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
import { ThucDonRequest, ThucDonResponse } from "@/types/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import apiClient from "@/lib/axios";

// BƯỚC 1: ĐỊNH NGHĨA SCHEMA CHO DỮ LIỆU "THÔ" TỪ FORM
// Mọi thứ đều là string, vì đó là bản chất của input HTML
const formInputSchema = z.object({
  tenMon: z.string().min(1, "Tên món không được để trống"),
  moTa: z.string().optional(),
  gia: z.string().min(1, "Giá không được để trống"),
  loaiMon: z.string().min(1, "Vui lòng chọn loại món"),
  urlHinhAnh: z.string().url("URL hình ảnh không hợp lệ"),
  khaDung: z.string().min(1, "Vui lòng chọn trạng thái"),
});

// BƯỚC 2: TẠO MỘT SCHEMA MỚI ĐỂ BIẾN ĐỔI DỮ LIỆU
// Schema này sẽ lấy dữ liệu từ `formInputSchema` và chuyển đổi nó sang kiểu mà API cần
const apiSchema = formInputSchema.transform((data) => ({
    ...data,
    gia: Number(data.gia),
    khaDung: data.khaDung === 'true',
}));

// Kiểu dữ liệu cho form sẽ là kiểu "thô" (toàn string)
type FormValues = z.infer<typeof formInputSchema>;

interface AddMenuFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMenuForm = ({ isOpen, onClose }: AddMenuFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  // useForm bây giờ làm việc với kiểu dữ liệu "thô"
  const form = useForm<FormValues>({
    resolver: zodResolver(formInputSchema), // Validate dựa trên schema "thô"
    defaultValues: {
      tenMon: "",
      moTa: "",
      gia: "0",
      loaiMon: "DO_UONG",
      urlHinhAnh: "",
      khaDung: "true",
    },
  });

  const mutation = useMutation<ThucDonResponse, Error, ThucDonRequest>({
    mutationFn: async (newMenuItem) => {
        const { data } = await apiClient.post('/thuc-don', newMenuItem, {
            headers: { Authorization: `Bearer ${session?.accessToken}` }
        });
        return data;
    },
    onSuccess: () => {
        toast.success("Thêm món mới thành công!");
        router.refresh(); 
        onClose();
        form.reset();
    },
    onError: (error) => {
        toast.error("Đã có lỗi xảy ra: " + error.message);
    }
  });

  // Hàm onSubmit nhận dữ liệu "thô"
  const onSubmit = (values: FormValues) => {
    // BƯỚC 3: DÙNG apiSchema ĐỂ PARSE VÀ BIẾN ĐỔI DỮ LIỆU
    // Nếu dữ liệu hợp lệ, `parsedValues` sẽ có kiểu đúng (gia: number, khaDung: boolean)
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
                <DialogTitle>Thêm món mới</DialogTitle>
                <DialogDescription>
                    Điền thông tin chi tiết cho món ăn hoặc đồ uống mới.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="tenMon"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tên món</FormLabel>
                            <FormControl>
                                <Input placeholder="Cà phê sữa" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gia"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Giá</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="25000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="loaiMon"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Loại món</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại món" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="DO_UONG">Đồ uống</SelectItem>
                                    <SelectItem value="DO_AN">Đồ ăn</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="khaDung"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="true">Khả dụng</SelectItem>
                                    <SelectItem value="false">Hết hàng</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="urlHinhAnh"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>URL Hình ảnh</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Hủy</Button>
                        </DialogClose>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
};