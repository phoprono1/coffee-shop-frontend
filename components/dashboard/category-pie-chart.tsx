// file: components/dashboard/category-pie-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySalesReport } from "@/types/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryPieChartProps {
  data?: CategorySalesReport[];
}

// Tạo một mảng màu sắc để biểu đồ trông đẹp hơn
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
];

export const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  return (
    <Card className="col-span-12 md:col-span-6">
      <CardHeader>
        <CardTitle>Doanh thu theo Danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="tongDoanhThu"
              nameKey="tenDanhMuc"
              label={(entry) =>
                `${((entry.tongDoanhThu / (data?.reduce((acc, curr) => acc + curr.tongDoanhThu, 0) || 1)) * 100).toFixed(0)}%`
              }
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
