/* eslint-disable @typescript-eslint/no-explicit-any */
// file: lib/auth.ts (FILE MỚI)

import { AuthOptions } from "next-auth"; // Import kiểu AuthOptions
import CredentialsProvider from "next-auth/providers/credentials";
import apiClient from "@/lib/axios";

// Định nghĩa kiểu dữ liệu trả về từ API và cho session
type LoginResponse = {
    token: string;
    email: string;
    chucVu: string;
    nhanVienId: number; // ID của nhân viên
};

// authOptions bây giờ nằm ở đây, và không có "export" cũng được nếu chỉ dùng trong file này
export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (data && data.token) {
                        return {
                            id: data.nhanVienId.toString(), // Chuyển đổi ID sang chuỗi nếu cần
                            email: data.email,
                            role: data.chucVu,
                            accessToken: data.token,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Login Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.role = user.role;
                token.id = user.id; // Lưu id người dùng nếu cần
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
                session.user.role = token.role;
                session.accessToken = token.accessToken;
                session.user.id = token.id; // Lưu id người dùng vào session
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};