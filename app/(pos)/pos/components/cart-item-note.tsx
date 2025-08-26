// file: app/(pos)/pos/components/cart-item-note.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cart-store";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";

interface CartItemNoteProps {
  itemId: number;
  initialNote?: string;
}

export const CartItemNote = ({ itemId, initialNote }: CartItemNoteProps) => {
  const [note, setNote] = useState(initialNote || "");
  const updateItemNote = useCartStore((state) => state.updateItemNote);

  const handleSave = () => {
    updateItemNote(itemId, note);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={initialNote ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Thêm ghi chú</h4>
            <p className="text-sm text-muted-foreground">
              Ví dụ: Ít đường, nhiều đá...
            </p>
          </div>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          <Button onClick={handleSave} size="sm">
            Lưu
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
