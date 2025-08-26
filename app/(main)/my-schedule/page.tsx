// file: app/(main)/my-schedule/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { LichLamViecResponse, CaLamViecResponse } from "@/types/api";
// TÁI SỬ DỤNG CalendarClient từ module schedules
import { CalendarClient } from "../schedules/calendar-client";

// Hàm fetch dữ liệu song song
const getMyScheduleData = async (
  accessToken: string | undefined,
  nhanVienId: number | undefined
) => {
  if (!accessToken || !nhanVienId)
    return { schedules: [], employees: [], shifts: [] };

  try {
    const [schedulesRes, shiftsRes] = await Promise.all([
      // Gọi API với query param để chỉ lấy lịch của mình
      apiClient.get(`/lich-lam-viec?nhanVienId=${nhanVienId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      apiClient.get("/ca-lam-viec", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    return {
      schedules: schedulesRes.data as LichLamViecResponse[],
      employees: [], // Không cần danh sách tất cả nhân viên
      shifts: shiftsRes.data as CaLamViecResponse[],
    };
  } catch (error) {
    console.error("Failed to fetch my schedule data:", error);
    return { schedules: [], employees: [], shifts: [] };
  }
};

const MySchedulePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { schedules, employees, shifts } = await getMyScheduleData(
    session.accessToken,
    session.user.id
  );

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Lịch làm việc của tôi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Xem lịch làm việc và ca trực của bạn
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

export default MySchedulePage;
