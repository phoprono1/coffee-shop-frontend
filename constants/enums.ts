// file: constants/enums.ts

export enum TrangThaiDonHang {
    DANG_CHO = "DANG_CHO",
    DANG_PHA_CHE = "DANG_PHA_CHE",
    DA_SAN_SANG = "DA_SAN_SANG",
    DA_PHUC_VU = "DA_PHUC_VU",
    DA_THANH_TOAN = "DA_THANH_TOAN",
    HUY = "HUY",
    HOAN_THANH = "HOAN_THANH",
}

export const TrangThaiDonHangLabels: Record<TrangThaiDonHang, string> = {
    [TrangThaiDonHang.DANG_CHO]: "Đang chờ",
    [TrangThaiDonHang.DANG_PHA_CHE]: "Đang pha chế",
    [TrangThaiDonHang.DA_SAN_SANG]: "Đã sẵn sàng",
    [TrangThaiDonHang.DA_PHUC_VU]: "Đã phục vụ",
    [TrangThaiDonHang.DA_THANH_TOAN]: "Đã thanh toán",
    [TrangThaiDonHang.HUY]: "Đã hủy",
    [TrangThaiDonHang.HOAN_THANH]: "Hoàn thành",
};

export enum TrangThaiThanhToan {
    DANG_CHO = "DANG_CHO",
    THANH_CONG = "THANH_CONG",
    THAT_BAI = "THAT_BAI",
    HOAN_TIEN = "HOAN_TIEN",
    MOT_PHAN = "MOT_PHAN",
}

export const TrangThaiThanhToanLabels: Record<TrangThaiThanhToan, string> = {
    [TrangThaiThanhToan.DANG_CHO]: "Đang chờ",
    [TrangThaiThanhToan.THANH_CONG]: "Thành công",
    [TrangThaiThanhToan.THAT_BAI]: "Thất bại",
    [TrangThaiThanhToan.HOAN_TIEN]: "Hoàn tiền",
    [TrangThaiThanhToan.MOT_PHAN]: "Một phần",
};

export enum PhuongThucThanhToan {
    TIEN_MAT = "TIEN_MAT",
    QR_CODE = "QR_CODE",
    THE_NGAN_HANG = "THE_NGAN_HANG",
    CHUYEN_KHOAN = "CHUYEN_KHOAN",
}

export const PhuongThucThanhToanLabels: Record<PhuongThucThanhToan, string> = {
    [PhuongThucThanhToan.TIEN_MAT]: "Tiền mặt",
    [PhuongThucThanhToan.QR_CODE]: "Quét mã QR",
    [PhuongThucThanhToan.THE_NGAN_HANG]: "Thẻ ngân hàng",
    [PhuongThucThanhToan.CHUYEN_KHOAN]: "Chuyển khoản",
};