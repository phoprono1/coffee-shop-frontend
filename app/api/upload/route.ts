// file: app/api/upload/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Tối ưu cho Vercel Edge Functions

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // Kiểm tra xem có file và tên file không
    if (!filename || !request.body) {
        return NextResponse.json(
            { message: 'Filename và nội dung file là bắt buộc.' },
            { status: 400 }
        );
    }

    try {
        // Hàm `put` sẽ tự động sử dụng BLOB_READ_WRITE_TOKEN
        // để upload file lên Vercel Blob store đã kết nối.
        const blob = await put(filename, request.body, {
            access: 'public', // Cho phép truy cập công khai để hiển thị ảnh
        });

        // Trả về đối tượng blob chứa URL của ảnh đã upload
        return NextResponse.json(blob);

    } catch (error) {
        console.error("Lỗi upload file:", error);
        return NextResponse.json(
            { message: 'Đã có lỗi xảy ra khi upload file.' },
            { status: 500 }
        );
    }
}