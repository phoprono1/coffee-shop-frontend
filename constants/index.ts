// file: constants/index.ts
import {
    LayoutDashboard,
    Coffee,
    Users,
    Warehouse, // Giữ lại icon này cho Kho
    BookOpenCheck, // Icon mới cho Thực đơn
    LayoutGrid,
    Armchair,
    Truck,
    TicketPercent,
    BookUser,
    Clock,
    ClipboardCheck,
    ClipboardPlus,
    MonitorPlay
} from 'lucide-react';

export const navLinks = [
    {
        href: "/pos",
        label: "Giao diện Bán hàng",
        icon: MonitorPlay,
    },
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
        icon: BookOpenCheck,
    },
    {
        href: "/categories",
        label: "Quản lý Danh mục",
        icon: LayoutGrid,
    },
    {
        href: "/inventory",
        label: "Quản lý Kho",
        icon: Warehouse,
    },

    {
        href: "/receipts",
        label: "Phiếu Nhập Kho",
        icon: ClipboardPlus,
    },
    {
        href: "/tables",
        label: "Quản lý Bàn",
        icon: Armchair,
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