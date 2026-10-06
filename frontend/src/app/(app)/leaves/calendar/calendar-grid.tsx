import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Holiday, LeaveRequestItem } from "@/lib/leave";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  year,
  month, // 1-indexed
  holidays,
  leaveRequests,
}: {
  year: number;
  month: number;
  holidays: Holiday[];
  leaveRequests: LeaveRequestItem[];
}): React.JSX.Element {
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leadingBlanks = firstOfMonth.getUTCDay();

  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };
  const monthLabel = firstOfMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const cells: Array<number | null> = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function dateKey(day: number): string {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function eventsFor(day: number): { holidayNames: string[]; leaveNames: string[] } {
    const key = dateKey(day);
    const holidayNames = holidays.filter((h) => h.date === key).map((h) => h.name);
    const leaveNames = leaveRequests
      .filter((r) => r.startDate <= key && r.endDate >= key)
      .map((r) => r.employeeName);
    return { holidayNames, leaveNames };
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/leaves/calendar?year=${prev.y}&month=${prev.m}`}
          className="hover:bg-muted rounded-md p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-lg font-semibold">{monthLabel}</h2>
        <Link
          href={`/leaves/calendar?year=${next.y}&month=${next.m}`}
          className="hover:bg-muted rounded-md p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <Card className="grid grid-cols-7 gap-px overflow-hidden p-0">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="bg-muted text-muted-foreground p-2 text-center text-xs font-medium"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <div key={`blank-${i}`} className="bg-background min-h-24" />
          ) : (
            <DayCell key={day} day={day} {...eventsFor(day)} />
          ),
        )}
      </Card>
    </div>
  );
}

function DayCell({
  day,
  holidayNames,
  leaveNames,
}: {
  day: number;
  holidayNames: string[];
  leaveNames: string[];
}): React.JSX.Element {
  return (
    <div className="bg-background min-h-24 p-2 text-sm">
      <div className="font-medium">{day}</div>
      <div className="mt-1 flex flex-col gap-1">
        {holidayNames.map((n) => (
          <Badge key={n} variant="success" className="w-fit text-[10px]">
            {n}
          </Badge>
        ))}
        {leaveNames.slice(0, 2).map((n) => (
          <Badge key={n} variant="secondary" className="w-fit text-[10px]">
            {n}
          </Badge>
        ))}
        {leaveNames.length > 2 && (
          <span className="text-muted-foreground text-[10px]">+{leaveNames.length - 2} more</span>
        )}
      </div>
    </div>
  );
}
