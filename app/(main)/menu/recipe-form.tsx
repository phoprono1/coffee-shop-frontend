// file: app/(main)/menu/recipe-form.tsx (Đã sửa lỗi TypeScript)
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ThucDonResponse,
  CongThucResponse,
  NguyenVatLieuResponse,
  CongThucRequest,
} from "@/types/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: ThucDonResponse | null;
}

// SỬA LỖI Ở ĐÂY: Tách schema input và schema transform
const formInputSchema = z.object({
  nguyenVatLieuId: z.string().min(1, "Vui lòng chọn nguyên vật liệu."),
  soLuongSuDung: z.string().min(0.000001, "Số lượng phải lớn hơn 0"), // Nhận vào là string
});

const apiSchema = formInputSchema.transform((data) => ({
  nguyenVatLieuId: Number(data.nguyenVatLieuId),
  soLuongSuDung: Number(data.soLuongSuDung),
}));

type FormValues = z.infer<typeof formInputSchema>;

export const RecipeForm = ({ isOpen, onClose, menuItem }: RecipeFormProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: allRecipes, isLoading: isLoadingRecipes } = useQuery<
    CongThucResponse[]
  >({
    queryKey: ["recipes", menuItem?.id], // Thêm menuItem.id để query được cache riêng cho từng món
    queryFn: async () =>
      (
        await apiClient.get("/cong-thuc", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session && !!menuItem, // Chỉ chạy khi có session và menuItem
  });

  const { data: allIngredients, isLoading: isLoadingIngredients } = useQuery<
    NguyenVatLieuResponse[]
  >({
    queryKey: ["ingredients"],
    queryFn: async () =>
      (
        await apiClient.get("/nguyen-vat-lieu", {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        })
      ).data,
    enabled: !!session,
  });

  const currentRecipe =
    allRecipes?.filter((r) => r.thucDon.id === menuItem?.id) || [];

  const addMutation = useMutation<
    CongThucResponse,
    Error,
    Omit<CongThucRequest, "thucDonId">
  >({
    mutationFn: (newData) => {
      if (!menuItem) throw new Error("Món ăn không hợp lệ");
      const payload: CongThucRequest = { ...newData, thucDonId: menuItem.id };
      return apiClient.post("/cong-thuc", payload, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Thêm nguyên vật liệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["recipes", menuItem?.id] });
      form.reset();
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (recipeId: number) => {
      return apiClient.delete(`/cong-thuc/${recipeId}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("Xóa nguyên vật liệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["recipes", menuItem?.id] });
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });

  // SỬA LỖI Ở ĐÂY: defaultValues phải khớp với kiểu string của input schema
  const form = useForm<FormValues>({
    resolver: zodResolver(formInputSchema),
    defaultValues: { nguyenVatLieuId: "", soLuongSuDung: "1" },
  });

  const onSubmit = (values: FormValues) => {
    const parsedValues = apiSchema.parse(values);
    addMutation.mutate(parsedValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quản lý Công thức cho: {menuItem?.tenMon}</DialogTitle>
          <DialogDescription>
            Thêm hoặc xóa các nguyên vật liệu cần thiết để tạo ra món ăn này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {isLoadingRecipes && <p>Đang tải công thức...</p>}
          {currentRecipe.length === 0 && !isLoadingRecipes && (
            <p>Chưa có nguyên vật liệu nào.</p>
          )}
          {currentRecipe.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <span>{item.nguyenVatLieu.tenNguyenLieu}</span>
              <div className="flex items-center gap-2">
                <span>
                  {item.soLuongSuDung} {item.nguyenVatLieu.donViTinh}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <hr />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start gap-4"
          >
            <FormField
              control={form.control}
              name="nguyenVatLieuId"
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
                      {isLoadingIngredients && (
                        <SelectItem value="loading" disabled>
                          Đang tải...
                        </SelectItem>
                      )}
                      {allIngredients?.map((ing) => (
                        <SelectItem key={ing.id} value={String(ing.id)}>
                          {ing.tenNguyenLieu}
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
              name="soLuongSuDung"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={addMutation.isPending}>
              Thêm
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
