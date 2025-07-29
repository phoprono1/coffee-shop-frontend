// file: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster
import { QueryProvider } from "@/components/providers/query-provider"; // Import QueryProvider
import { AuthProvider } from "@/components/providers/auth-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Cà phê",
  description: "Frontend cho dự án quản lý quán cà phê",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}