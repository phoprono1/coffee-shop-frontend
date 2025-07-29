// file: app/(main)/menu/menu-client.tsx (cập nhật)
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ThucDonResponse } from "@/types/api";
import { columns } from "./columns";
import { AddMenuForm } from "./add-menu-form"; // Import form mới

interface MenuClientProps {
    data: ThucDonResponse[];
}

export const MenuClient = ({ data }: MenuClientProps) => {
    // State để điều khiển việc mở/đóng dialog
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* Component form dialog, nó chỉ hiện khi isModalOpen là true */}
            <AddMenuForm 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Thực đơn ({data.length})</h1>
                    {/* Nút này giờ sẽ mở dialog */}
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm mới
                    </Button>
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}