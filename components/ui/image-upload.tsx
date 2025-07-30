// file: components/ui/image-upload.tsx (Phiên bản Optimistic UI)
"use client";

import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[]; // Đây là URL thật từ Vercel Blob
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  // State mới để lưu URL preview cục bộ
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Tạo và hiển thị URL preview cục bộ ngay lập tức
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload thất bại. Vui lòng thử lại.");
      }

      const newBlob = await response.json();
      // Gửi URL thật về cho form
      onChange(newBlob.url);
      toast.success("Tải lên thành công!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra.");
      // Nếu lỗi, xóa preview
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Dọn dẹp URL cục bộ để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Ưu tiên hiển thị preview cục bộ nếu có, nếu không thì hiển thị ảnh từ Vercel
  const displayUrl = previewUrl || (value.length > 0 ? value[0] : null);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {displayUrl && (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => {
                  // Nếu đang xem preview, chỉ cần xóa preview
                  if (previewUrl) {
                    setPreviewUrl(null);
                  } else {
                    // Nếu là ảnh thật, gọi hàm onRemove
                    onRemove(displayUrl);
                  }
                }}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={displayUrl} />
          </div>
        )}
      </div>

      {/* Chỉ hiển thị nút upload khi chưa có ảnh */}
      {!displayUrl && (
        <Button
          type="button"
          disabled={disabled || isUploading}
          variant="secondary"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          {isUploading ? "Đang tải lên..." : "Tải lên hình ảnh"}
        </Button>
      )}

      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={disabled || isUploading}
      />
    </div>
  );
};
