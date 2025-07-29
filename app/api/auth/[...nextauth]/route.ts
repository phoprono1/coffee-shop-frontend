import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import apiClient from "@/lib/axios"; // Dùng lại axios client của chúng ta

// Định nghĩa kiểu dữ liệu trả về từ API và cho session
type LoginResponse = {
    token: string;
    email: string;
    chucVu: string;
};

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            // Hàm authorize này là nơi điều kỳ diệu xảy ra
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Gọi đến API Spring Boot của bạn
                    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (data && data.token) {
                        // Nếu thành công, trả về một object chứa thông tin user và token
                        // Dữ liệu này sẽ được truyền vào callback `jwt`
                        return {
                            id: data.email, // Dùng email làm id tạm thời
                            email: data.email,
                            role: data.chucVu,
                            accessToken: data.token,
                        };
                    }
                    // Trả về null nếu đăng nhập thất bại
                    return null;
                } catch (error) {
                    // Bắt lỗi từ axios (ví dụ: 401 Unauthorized) và trả về null
                    console.error("Login Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        // Callback này được gọi sau khi `authorize` thành công
        // Nó nhận `token` (từ `authorize`) và `user` (cũng từ `authorize`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                // Lần đăng nhập đầu tiên, gắn thêm các thuộc tính từ user vào token
                token.accessToken = user.accessToken;
                token.role = user.role;
            }
            return token;
        },

        // Callback này được gọi để tạo object `session` mà client có thể truy cập
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
                // Thêm các thuộc tính từ token vào session
                session.user.role = token.role;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login", // Chuyển hướng người dùng đến trang /login nếu họ chưa đăng nhập
    },
    session: {
        strategy: "jwt" as const, // Bắt buộc dùng JWT strategy
    },
    secret: process.env.NEXTAUTH_SECRET, // Key bí mật để mã hóa JWT
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };