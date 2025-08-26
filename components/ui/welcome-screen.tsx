import { Coffee, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface WelcomeScreenProps {
  userName?: string;
}

export function WelcomeScreen({ userName }: WelcomeScreenProps) {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-6 rounded-full">
              <Coffee className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Chào mừng {userName ? userName : "bạn"}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hệ thống quản lý quán cà phê chuyên nghiệp giúp bạn điều hành kinh
              doanh hiệu quả
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quản lý Doanh thu</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Theo dõi và phân tích doanh thu, lợi nhuận theo thời gian thực
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quản lý Nhân sự</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lịch làm việc, chấm công và quản lý hiệu suất nhân viên
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Hệ thống POS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bán hàng nhanh chóng với giao diện đơn giản và thân thiện
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Vào Dashboard
            </Button>
          </Link>
          <Link href="/pos">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg font-medium"
            >
              Mở POS
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              15+
            </div>
            <div className="text-sm text-gray-500">Tính năng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              24/7
            </div>
            <div className="text-sm text-gray-500">Hỗ trợ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              99.9%
            </div>
            <div className="text-sm text-gray-500">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Secure
            </div>
            <div className="text-sm text-gray-500">Bảo mật</div>
          </div>
        </div>
      </div>
    </div>
  );
}
