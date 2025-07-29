/* eslint-disable @typescript-eslint/no-explicit-any */
// file: types/api.ts
// Dựa trên openapi.json của bạn

export interface BanResponse {
    id: number;
    soBan: string;
    viTri: string;
    sucChua: number;
    trangThaiBan: "TRONG" | "CO_KHACH" | "DA_DAT_TRUOC"; // Giả sử có các trạng thái này
}

export interface DonHangResponse {
    id: number;
    ban: BanResponse | null;
    nhanVienTao: any; // Bỏ qua chi tiết nhân viên cho đơn giản
    thoiGianTao: string; // "2024-07-28T10:00:00"
    tongTienThanhToan: number;
    trangThaiDonHang: string;
    chiTietDonHangs: any[]; // Bỏ qua chi tiết cho đơn giản
}

export interface ThucDonResponse {
    id: number;
    tenMon: string;
    moTa: string;
    gia: number;
    loaiMon: string;
    urlHinhAnh: string;
    khaDung: boolean;
}

export interface ThucDonRequest {
    tenMon: string;
    moTa?: string;
    gia: number;
    loaiMon: string;
    urlHinhAnh: string;
    khaDung: boolean;
}