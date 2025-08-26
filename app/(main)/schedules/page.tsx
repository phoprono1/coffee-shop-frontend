// file: app/(main)/schedules/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import {
  LichLamViecResponse,
  NhanVienResponse,
  CaLamViecResponse,
} from "@/types/api";
import { CalendarClient } from "./calendar-client";

// Hàm fetch dữ liệu song song
const getScheduleData = async (accessToken: string | undefined) => {
  if (!accessToken) return { schedules: [], employees: [], shifts: [] };

  try {
    const [schedulesRes, employeesRes, shiftsRes] = await Promise.all([
      apiClient.get("/lich-lam-viec", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      apiClient.get("/nhan-vien", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      apiClient.get("/ca-lam-viec", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    return {
      schedules: schedulesRes.data as LichLamViecResponse[],
      employees: employeesRes.data as NhanVienResponse[],
      shifts: shiftsRes.data as CaLamViecResponse[],
    };
  } catch (error) {
    console.error("Failed to fetch schedule data:", error);
    return { schedules: [], employees: [], shifts: [] };
  }
};

const SchedulesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { schedules, employees, shifts } = await getScheduleData(
    session.accessToken
  );

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Quản lý Lịch làm việc
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sắp xếp và quản lý lịch làm việc của nhân viên
          </p>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="h-[calc(100vh-280px)] min-h-[600px]">
        <CalendarClient
          initialSchedules={schedules}
          employees={employees}
          shifts={shifts}
        />
      </div>
    </div>
  );
};

export default SchedulesPage;
