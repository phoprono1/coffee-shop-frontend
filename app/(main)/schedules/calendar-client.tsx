// file: app/(main)/schedules/calendar-client.tsx
"use client";

import { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import {
  CaLamViecResponse,
  LichLamViecResponse,
  NhanVienResponse,
} from "@/types/api";
import { ScheduleForm } from "./schedule-form";
// Chúng ta sẽ tạo ScheduleForm sau
// import { ScheduleForm } from './schedule-form';

interface CalendarClientProps {
  initialSchedules: LichLamViecResponse[];
  employees: NhanVienResponse[];
  shifts: CaLamViecResponse[];
}

// Định nghĩa các hằng số màu sắc cho dễ quản lý
const STATUS_COLORS = {
  DUYET: "#22c55e", // Green
  DANG_KY: "#f97316", // Orange
  TU_CHOI: "#ef4444", // Red
  DEFAULT: "#3b82f6", // Blue
};

export const CalendarClient = ({
  initialSchedules,
  employees,
  shifts,
}: CalendarClientProps) => {
  // State để quản lý việc mở/đóng form dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State để lưu dữ liệu cho form (khi thêm mới hoặc sửa)
  const [selectedSchedule, setSelectedSchedule] =
    useState<Partial<LichLamViecResponse> | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Dùng useMemo để chỉ định dạng lại dữ liệu khi `initialSchedules` thay đổi
  const events = useMemo((): EventInput[] => {
    return initialSchedules.map((schedule) => ({
      id: String(schedule.id),
      title: `${schedule.nhanVien.ten} - ${schedule.caLamViec.tenCa}`,
      start: `${schedule.ngay}T${schedule.caLamViec.gioBatDau}`,
      end: `${schedule.ngay}T${schedule.caLamViec.gioKetThuc}`,
      backgroundColor:
        STATUS_COLORS[schedule.trangThai as keyof typeof STATUS_COLORS] ||
        STATUS_COLORS.DEFAULT,
      borderColor:
        STATUS_COLORS[schedule.trangThai as keyof typeof STATUS_COLORS] ||
        STATUS_COLORS.DEFAULT,
      extendedProps: {
        scheduleData: schedule, // Lưu toàn bộ dữ liệu gốc để sử dụng khi click
      },
    }));
  }, [initialSchedules]);

  // Xử lý khi người dùng click vào một event đã có trên lịch
  const handleEventClick = (clickInfo: EventClickArg) => {
    // Lấy dữ liệu gốc chúng ta đã lưu trong extendedProps
    const scheduleData = clickInfo.event.extendedProps
      .scheduleData as LichLamViecResponse;
    setSelectedSchedule(scheduleData);
    setIsFormOpen(true);
  };

  // Xử lý khi người dùng chọn (bôi đen) một hoặc nhiều ngày trên lịch
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Mở form ở chế độ "Thêm mới"
    setSelectedSchedule(null);
    // Lưu lại ngày đã chọn
    setSelectedDate(selectInfo.startStr);
    setIsFormOpen(true);
  };

  return (
    <>
      <ScheduleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedSchedule}
        selectedDate={selectedDate}
        employees={employees}
        shifts={shifts}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
        {/* Calendar Header Info */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Lịch làm việc
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click vào ngày để thêm ca làm việc mới
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Đã duyệt
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Đăng ký
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Từ chối
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="p-4 h-[calc(100%-80px)]">
          <div className="h-full calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              height="100%"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              weekends={true}
              events={events}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={3}
              select={handleDateSelect}
              eventClick={handleEventClick}
              locale="vi"
              buttonText={{
                today: "Hôm nay",
                month: "Tháng",
                week: "Tuần",
                day: "Ngày",
              }}
              eventDisplay="block"
              dayHeaderFormat={{ weekday: "short" }}
              eventTextColor="#ffffff"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .calendar-container .fc {
          font-size: 14px;
        }

        .calendar-container .fc-theme-standard .fc-scrollgrid {
          border-color: #e5e7eb;
        }

        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: #e5e7eb;
        }

        .calendar-container .fc-daygrid-day {
          min-height: 100px;
        }

        .calendar-container .fc-daygrid-day-number {
          padding: 8px;
          font-weight: 500;
        }

        .calendar-container .fc-event {
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          margin: 1px;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }

        .calendar-container .fc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.2s;
        }

        .calendar-container .fc-button-primary {
          background-color: #f59e0b;
          border-color: #f59e0b;
          color: white;
        }

        .calendar-container .fc-button-primary:hover {
          background-color: #d97706;
          border-color: #d97706;
        }

        .calendar-container .fc-button-primary:not(:disabled):active,
        .calendar-container .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #b45309;
          border-color: #b45309;
        }

        .calendar-container .fc-today {
          background-color: #fef3c7 !important;
        }

        .dark .calendar-container .fc-today {
          background-color: #451a03 !important;
        }

        .calendar-container .fc-col-header-cell {
          background-color: #f9fafb;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.025em;
        }

        .dark .calendar-container .fc-col-header-cell {
          background-color: #1f2937;
          color: #d1d5db;
        }

        .calendar-container .fc-daygrid-more-link {
          color: #f59e0b;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .calendar-container .fc-toolbar {
            flex-direction: column;
            gap: 10px;
          }

          .calendar-container .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }

          .calendar-container .fc-daygrid-day {
            min-height: 80px;
          }
        }
      `}</style>
    </>
  );
};
