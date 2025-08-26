// file: store/cart-store.ts
import { create } from 'zustand';
import { ThucDonResponse, BanResponse, KhuyenMaiResponse } from '@/types/api';

// Định nghĩa một item trong giỏ hàng
export interface CartItem extends ThucDonResponse {
    quantity: number;
    note?: string; // Ghi chú tùy chỉnh cho sản phẩm
}

// Định nghĩa trạng thái của store
type CartState = {
    items: CartItem[];
    table: BanResponse | null;
    promotion: KhuyenMaiResponse | null; // <-- STATE MỚI
    addItem: (product: ThucDonResponse) => void;
    removeItem: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    updateItemNote: (productId: number, note: string) => void; // <-- ACTION MỚI
    setTable: (table: BanResponse | null) => void;
    setPromotion: (promotion: KhuyenMaiResponse | null) => void; // <-- ACTION MỚI
    clearCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    table: null,
    promotion: null, // <-- Giá trị mặc định
    addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
            // Nếu sản phẩm đã tồn tại, chỉ tăng số lượng
            set({
                items: items.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng
            set({ items: [...items, { ...product, quantity: 1 }] });
        }
    },

    removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
    },

    increaseQuantity: (productId) => {
        set({
            items: get().items.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ),
        });
    },

    decreaseQuantity: (productId) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === productId);

        if (existingItem && existingItem.quantity > 1) {
            set({
                items: items.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ),
            });
        } else {
            // Nếu số lượng là 1, giảm nữa sẽ xóa khỏi giỏ
            get().removeItem(productId);
        }
    },

    // THÊM ACTION MỚI VÀO ĐÂY
    updateItemNote: (productId, note) => {
        set({
            items: get().items.map((item) =>
                item.id === productId ? { ...item, note } : item
            ),
        });
    },

    setTable: (table) => set({ table }),
    setPromotion: (promotion) => set({ promotion }),

    clearCart: () => set({ items: [], table: null, promotion: null }),
}));