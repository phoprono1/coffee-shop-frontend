// file: components/dashboard/payment-method-pie-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethodSales } from "@/types/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PhuongThucThanhToanLabels } from "@/constants/enums";

interface PaymentMethodPieChartProps {
  data?: PaymentMethodSales[];
}

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#AF19FF"];

export const PaymentMethodPieChart = ({ data }: PaymentMethodPieChartProps) => {
  // Map dữ liệu để có label đẹp hơn
  const chartData = data?.map((item) => ({
    ...item,
    phuongThuc:
      PhuongThucThanhToanLabels[
        item.phuongThuc as keyof typeof PhuongThucThanhToanLabels
      ] || item.phuongThuc,
  }));

  return (
    <Card className="col-span-12 md:col-span-6">
      <CardHeader>
        <CardTitle>Doanh thu theo PTTT</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="tongSoTien"
              nameKey="phuongThuc"
              label={(entry) =>
                `${((entry.tongSoTien / (chartData?.reduce((acc, curr) => acc + curr.tongSoTien, 0) || 1)) * 100).toFixed(0)}%`
              }
            >
              {chartData?.map((entry, index) => (
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
