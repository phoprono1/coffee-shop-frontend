import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Mở rộng kiểu dữ liệu của session mặc định
declare module "next-auth" {
    /**
     * Trả về khi sử dụng `useSession`, `getSession` hoặc `getServerSession`
     */
    interface Session {
        // Thêm accessToken vào session
        accessToken?: string;
        user: {
            // Thêm role vào user trong session
            role?: string;
            // Thêm id vào user trong session
            id?: number;
        } & DefaultSession["user"]; // Giữ lại các thuộc tính mặc định (name, email, image)
    }
}

// Mở rộng kiểu dữ liệu của JWT
declare module "next-auth/jwt" {
    /** Trả về bởi callback `jwt` và nhận bởi callback `session` */
    interface JWT {
        // Thêm các thuộc tính tùy chỉnh vào token
        role?: string;
        accessToken?: string;
        id?: number; // Thêm id vào token
    }
}