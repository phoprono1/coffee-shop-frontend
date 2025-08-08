/* eslint-disable @typescript-eslint/no-explicit-any */
// file: types/api.ts

import { TrangThaiDonHang } from "@/constants/enums";

// Dựa trên openapi.json của bạn
export interface ThucDonResponse {
    id: number;
    tenMon: string;
    moTa: string;
    gia: number;
    // Bỏ: loaiMon: string;
    danhMuc: DanhMucResponse; // <-- THAY ĐỔI Ở ĐÂY
    urlHinhAnh: string;
    khaDung: boolean;
}

export interface ThucDonRequest {
    tenMon: string;
    moTa?: string;
    gia: number;
    danhMucId: number; // <-- THAY ĐỔI Ở ĐÂY
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

// file: types/api.ts (thêm vào cuối file)

export interface NhaCungCapResponse {
    id: number;
    tenNhaCungCap: string;
    diaChi: string;
    soDienThoai: string;
    email: string;
}

export interface NhaCungCapRequest {
    tenNhaCungCap: string;
    diaChi: string;
    soDienThoai: string;
    email: string;
}

export interface ChiTietPhieuNhapKhoRequest {
    nguyenVatLieuId: number;
    soLuongNhap: number;
    donGiaNhap: number;
}

export interface PhieuNhapKhoRequest {
    nhaCungCapId: number;
    nhanVienId?: number; // Sẽ lấy từ session, nên có thể tùy chọn
    ngayNhap: string; // "YYYY-MM-DD"
    ghiChu?: string;
    chiTietPhieuNhapKhos: ChiTietPhieuNhapKhoRequest[];
}

export interface ChiTietPhieuNhapKhoResponse {
    id: number;
    nguyenVatLieu: NguyenVatLieuResponse;
    soLuongNhap: number;
    donGiaNhap: number;
}

export interface PhieuNhapKhoResponse {
    id: number;
    nhaCungCap: NhaCungCapResponse;
    nhanVienNhap: NhanVienResponse;
    ngayNhap: string;
    tongTienNhap: number;
    ghiChu: string;
    chiTietPhieuNhapKhos: ChiTietPhieuNhapKhoResponse[];
}

export interface KhuyenMaiResponse {
    id: number;
    tenKhuyenMai: string;
    moTa: string;
    phanTramGiamGia: number;
    giaTriGiamGiaCoDinh: number;
    giaTriToiThieuApDung: number;
    ngayBatDau: string; // "YYYY-MM-DD"
    ngayKetThuc: string; // "YYYY-MM-DD"
    trangThaiKichHoat: boolean;
}

export interface KhuyenMaiRequest {
    tenKhuyenMai: string;
    moTa?: string;
    phanTramGiamGia?: number;
    giaTriGiamGiaCoDinh?: number;
    giaTriToiThieuApDung: number;
    ngayBatDau: string;
    ngayKetThuc: string;
    trangThaiKichHoat: boolean;
}

export interface BanResponse {
    id: number;
    soBan: string;
    viTri: string;
    sucChua: number;
    trangThaiBan: "TRONG" | "CO_KHACH" | "CAN_DON"; // Giả sử có các trạng thái này
}

// Thêm mới BanRequest
export interface BanRequest {
    viTri: string;
    sucChua: number;
}

export interface ChiTietDonHangResponse {
    id: number;
    thucDon: ThucDonResponse;
    soLuong: number;
    giaBanTaiThoiDiem: number;
    ghiChuTuyChinh: string;
}

// Cập nhật DonHangResponse để đảm bảo các trường đầy đủ
export interface DonHangResponse {
    id: number;
    ban: BanResponse | null; // Có thể null nếu là đơn mang đi
    nhanVienTao: NhanVienResponse;
    thoiGianTao: string; // "YYYY-MM-DDTHH:mm:ss"
    thoiGianCapNhat: string;
    tongTienTruocKhuyenMai: number;
    tongTienThanhToan: number;
    trangThaiDonHang: TrangThaiDonHang; // ví dụ: "DA_DAT", "DA_THANH_TOAN", "DA_HUY"
    khuyenMai: KhuyenMaiResponse | null;
    chiTietDonHangs: ChiTietDonHangResponse[];
    thanhToans: any[]; // Tạm thời để any
}

export interface DonHangRequest {
    banId: number | null; // Có thể null nếu là đơn mang đi
    nhanVienId: number;
    chiTietDonHangs: {
        thucDonId: number;
        soLuong: number;
        ghiChuTuyChinh?: string; // Có thể tùy chọn
    }[];
    khuyenMaiId?: number; // Có thể tùy chọn
}

export interface DanhMucResponse {
    id: number;
    tenDanhMuc: string;
    moTa: string;
}

export interface DanhMucRequest {
    tenDanhMuc: string;
    moTa?: string;
}

export interface ThanhToanRequest {
    phuongThucThanhToan: string; // Sẽ là giá trị từ enum PhuongThucThanhToan
    soTienThanhToan: number;
    maGiaoDich?: string; // Tùy chọn, cho VNPay sau này
}
export interface VnpayPaymentRequest {
    orderId: number;
    amount: number;
}

export interface VnpayPaymentResponse {
    vnpayUrl: string;
    orderId: string;
    txnRef: string;
    message: string;
    code: string;
}