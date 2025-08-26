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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Nhân viên
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý thông tin nhân viên, chức vụ và lương cơ bản
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <EmployeesClient data={employeesData} />
      </div>
    </div>
  );
};

export default EmployeesPage;
