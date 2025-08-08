// file: app/(main)/receipts/receipt-form.tsx
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  PhieuNhapKhoRequest,
  NguyenVatLieuResponse,
  NhaCungCapResponse,
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
import { PlusCircle, Trash2 } from "lucide-react";

const detailSchema = z.object({
  nguyenVatLieuId: z.string().min(1, "Vui lòng chọn"),
  soLuongNhap: z
    .string()
    .refine((val) => Number(val) > 0, { message: "Phải > 0" }),
  donGiaNhap: z
    .string()
    .refine((val) => Number(val) >= 0, { message: "Không âm" }),
});

const formSchema = z.object({
  nhaCungCapId: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  ngayNhap: z.string().min(1, "Vui lòng chọn ngày nhập"),
  ghiChu: z.string().optional(),
  chiTietPhieuNhapKhos: z
    .array(detailSchema)
    .min(1, "Phải có ít nhất một nguyên vật liệu"),
});

const apiSchema = formSchema.transform((data) => ({
  ...data,
  nhaCungCapId: Number(data.nhaCungCapId),
  chiTietPhieuNhapKhos: data.chiTietPhieuNhapKhos.map((item) => ({
    nguyenVatLieuId: Number(item.nguyenVatLieuId),
    soLuongNhap: Number(item.soLuongNhap),
    donGiaNhap: Number(item.donGiaNhap),
  })),
}));

type FormValues = z.infer<typeof formSchema>;

interface ReceiptFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptForm = ({ isOpen, onClose }: ReceiptFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ngayNhap: new Date().toISOString().split("T")[0],
      ghiChu: "",
      chiTietPhieuNhapKhos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chiTietPhieuNhapKhos",
  });
  const { data: suppliers } = useQuery<NhaCungCapResponse[]>({
    queryKey: ["suppliers"],
    queryFn: async () =>
      (
        await apiClient.get("/nha-cung-cap", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });
  const { data: ingredients } = useQuery<NguyenVatLieuResponse[]>({
    queryKey: ["ingredients"],
    queryFn: async () =>
      (
        await apiClient.get("/nguyen-vat-lieu", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation = useMutation<any, Error, PhieuNhapKhoRequest>({
    mutationFn: (data) =>
      apiClient.post("/phieu-nhap-kho", data, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      }),
    onSuccess: () => {
      toast.success("Tạo phiếu nhập thành công!");
      router.refresh();
      onClose();
      form.reset();
    },
    onError: (error) => toast.error("Lỗi: " + error.message),
  });

  const onSubmit = (values: FormValues) => {
    const parsedValues = apiSchema.parse(values);
    mutation.mutate(parsedValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Tạo Phiếu Nhập Kho</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nhaCungCapId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhà cung cấp</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhà cung cấp..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.tenNhaCungCap}
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
                name="ngayNhap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày nhập</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ghiChu"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <hr />
            <div>
              <h3 className="text-lg font-medium mb-2">Chi tiết phiếu nhập</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-4 p-2 border rounded-md"
                  >
                    <FormField
                      control={form.control}
                      name={`chiTietPhieuNhapKhos.${index}.nguyenVatLieuId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn nguyên vật liệu..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ingredients?.map((i) => (
                                <SelectItem key={i.id} value={String(i.id)}>
                                  {i.tenNguyenLieu} ({i.donViTinh})
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
                      name={`chiTietPhieuNhapKhos.${index}.soLuongNhap`}
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          {index === 0 && <FormLabel>Số lượng</FormLabel>}
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Số lượng"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* SỬA LẠI FORMFIELD ĐƠN GIÁ */}
                    <FormField
                      control={form.control}
                      name={`chiTietPhieuNhapKhos.${index}.donGiaNhap`}
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          {index === 0 && <FormLabel>Đơn giá</FormLabel>}
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Đơn giá"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-1 flex items-center h-full">
                      {/* Thêm một div trống để giữ nút Xóa thẳng hàng nếu có label */}
                      {index === 0 && <div className="h-[14px]" />}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        className="mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() =>
                  append({
                    nguyenVatLieuId: "",
                    soLuongNhap: "1",
                    donGiaNhap: "0",
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm nguyên vật liệu
              </Button>
              {form.formState.errors.chiTietPhieuNhapKhos?.root && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.chiTietPhieuNhapKhos.root.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Đang lưu..." : "Lưu phiếu nhập"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
