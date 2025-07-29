// file: app/api/auth/[...nextauth]/route.ts (Đã cập nhật)

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import từ file mới

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };