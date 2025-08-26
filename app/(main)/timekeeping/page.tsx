// file: app/(main)/timekeeping/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import apiClient from "@/lib/axios";
import { ChamCongResponse } from "@/types/api";
import { TimekeepingClient } from "./timekeeping-client";

const getTimekeepingData = async (
  accessToken: string | undefined
): Promise<ChamCongResponse[]> => {
  if (!accessToken) return [];
  try {
    const response = await apiClient.get("/cham-cong", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch timekeeping data:", error);
    return [];
  }
};

const TimekeepingPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const timekeepingData = await getTimekeepingData(session.accessToken);

  return <TimekeepingClient data={timekeepingData} />;
};

export default TimekeepingPage;
