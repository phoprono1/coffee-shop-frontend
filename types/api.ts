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
export interface NguyenVatLieuRequest {
    tenNguyenLieu: string;
    donViTinh: string;
    soLuongTonHienTai: number;
    mucCanhBaoTonKho: number;
}

export interface NguyenVatLieuResponse {
    id: number;
    tenNguyenLieu: string;
    donViTinh: string;
    soLuongTonHienTai: number;
    mucCanhBaoTonKho: number;
}

export interface CongThucResponse {
    id: number;
    thucDon: ThucDonResponse;
    nguyenVatLieu: NguyenVatLieuResponse;
    soLuongSuDung: number;
}

export interface CongThucRequest {
    thucDonId: number;
    nguyenVatLieuId: number;
    soLuongSuDung: number;
}

export interface NhanVienResponse {
    id: number;
    ten: string;
    email: string;
    sdt: string;
    chucVu: string; // Sẽ là một trong các giá trị của Enum
    ngayVaoLam: string; // "YYYY-MM-DD"
    luongCoBan: number;
}

export interface NhanVienRequest {
    ten: string;
    email: string;
    sdt?: string;
    chucVu: string;
    ngayVaoLam: string;
    luongCoBan: number;
    matKhau?: string; // Mật khẩu không bắt buộc khi cập nhật
}