// file: constants/index.ts
import {
    LayoutDashboard,
    Coffee,
    Users,
    Warehouse,
    Truck,
    TicketPercent,
    BookUser,
    Clock,
    ClipboardCheck,
} from 'lucide-react';

export const navLinks = [
    {
        href: "/dashboard",
        label: "Tổng quan",
        icon: LayoutDashboard,
    },
    {
        href: "/orders",
        label: "Quản lý Đơn hàng",
        icon: Coffee,
    },
    {
        href: "/menu",
        label: "Quản lý Thực đơn",
        icon: Warehouse,
    },
    {
        href: "/employees",
        label: "Quản lý Nhân viên",
        icon: Users,
    },
    {
        href: "/suppliers",
        label: "Nhà cung cấp",
        icon: Truck,
    },
    {
        href: "/promotions",
        label: "Khuyến mãi",
        icon: TicketPercent,
    },
    {
        href: "/shifts",
        label: "Ca làm việc",
        icon: BookUser,
    },
    {
        href: "/schedules",
        label: "Lịch làm việc",
        icon: Clock,
    },
    {
        href: "/timekeeping",
        label: "Chấm công",
        icon: ClipboardCheck,
    },
];