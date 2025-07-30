// file: app/(main)/employees/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { NhanVienResponse } from "@/types/api";
import { EmployeesClient } from "./employees-client";

const getEmployees = async (
  accessToken: string | undefined
): Promise<NhanVienResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/nhan-vien", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return [];
  }
};

const EmployeesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const employeesData = await getEmployees(session.accessToken);

  return <EmployeesClient data={employeesData} />;
};

export default EmployeesPage;
