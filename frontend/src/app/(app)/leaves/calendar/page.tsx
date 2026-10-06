import { auth } from "@/auth";
import { listHolidays, listLeaveRequests } from "@/lib/leave";
import { CalendarGrid } from "./calendar-grid";

export default async function LeaveCalendarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  const params = await searchParams;
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const now = new Date();
  const year = Number(params["year"] ?? now.getUTCFullYear());
  const month = Number(params["month"] ?? now.getUTCMonth() + 1);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const fromDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const toDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const [holidays, leaveRequests] = await Promise.all([
    listHolidays(session.accessToken, year),
    listLeaveRequests(session.accessToken, { status: "approved", fromDate, toDate }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Leave calendar</h1>
      <CalendarGrid year={year} month={month} holidays={holidays} leaveRequests={leaveRequests} />
    </div>
  );
}
