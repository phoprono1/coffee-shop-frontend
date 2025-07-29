// file: app/(main)/menu/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import apiClient from "@/lib/axios";
import { ThucDonResponse } from "@/types/api";
import { MenuClient } from "./menu-client";

// Hàm lấy dữ liệu từ API
const getMenu = async (accessToken: string | undefined): Promise<ThucDonResponse[]> => {
    if (!accessToken) {
        return [];
    }
    try {
        const response = await apiClient.get("/thuc-don", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch menu:", error);
        return [];
    }
}

const MenuPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }

    const menuData = await getMenu(session.accessToken);
    
    return <MenuClient data={menuData} />;
}

export default MenuPage;