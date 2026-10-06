import { auth } from "@/auth";
import { listHolidays } from "@/lib/leave";
import { LeaveSubnav } from "../leaves/leave-subnav";
import { HolidaysTable } from "./holidays-table";

export default async function HolidaysPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const year = new Date().getFullYear();
  const holidays = await listHolidays(session.accessToken, year);

  return (
    <div className="space-y-6">
      <LeaveSubnav />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Holidays</h1>
      </div>
      <HolidaysTable
        initialHolidays={holidays}
        year={year}
        canWrite={session.user.role === "org_admin"}
      />
    </div>
  );
}
