// file: constants/index.ts
import {
    LayoutDashboard,
    Coffee,
    Users,
    Warehouse,
    BookOpenCheck,
    LayoutGrid,
    Armchair,
    Truck,
    TicketPercent,
    BookUser,
    ClipboardCheck,
    ClipboardPlus,
    MonitorPlay,
    CalendarClock,
    CalendarPlus,
    LayoutList
} from 'lucide-react';

export const navLinks = [
    // --- NHÓM VẬN HÀNH HÀNG NGÀY ---
    // Các chức năng nhân viên sử dụng thường xuyên nhất
    {
        href: "/pos",
        label: "Giao diện Bán hàng",
        icon: MonitorPlay,
    },
    {
        href: "/table-map",
        label: "Sơ đồ Bàn",
        icon: LayoutList,
    },
    {
        href: "/orders",
        label: "Lịch sử Đơn hàng",
        icon: Coffee,
    },

    // --- NHÓM QUẢN LÝ & BÁO CÁO ---
    // Công cụ cho người quản lý theo dõi hoạt động
    {
        href: "/dashboard",
        label: "Tổng quan",
        icon: LayoutDashboard,
    },

    // --- NHÓM THIẾT LẬP SẢN PHẨM & KHO ---
    // Cấu hình các yếu tố liên quan đến sản phẩm và kho vận
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
        href: "/suppliers",
        label: "Nhà cung cấp",
        icon: Truck,
    },

    // --- NHÓM QUẢN LÝ KINH DOANH & VẬN HÀNH ---
    {
        href: "/promotions",
        label: "Khuyến mãi",
        icon: TicketPercent,
    },
    {
        href: "/tables",
        label: "Thiết lập Bàn",
        icon: Armchair,
    },

    // --- NHÓM QUẢN LÝ NHÂN SỰ ---
    // Các chức năng liên quan đến nhân viên và lịch làm việc
    {
        href: "/schedules",
        label: "Lịch làm việc (Quản lý)",
        icon: CalendarClock,
    },
    {
        href: "/my-schedule",
        label: "Lịch của tôi (Nhân viên)",
        icon: CalendarPlus,
    },
    {
        href: "/timekeeping",
        label: "Dữ liệu Chấm công",
        icon: ClipboardCheck,
    },
    {
        href: "/employees",
        label: "Quản lý Nhân viên",
        icon: Users,
    },
    {
        href: "/shifts",
        label: "Quản lý Ca làm việc",
        icon: BookUser,
    },
];