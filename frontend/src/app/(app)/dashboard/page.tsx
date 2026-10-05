import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, CalendarDays, FileText, Wallet, Inbox } from "lucide-react";

const KPIS = [
  { label: "Employees", value: "—", icon: Users },
  { label: "Pending leave", value: "—", icon: CalendarDays },
  { label: "Expiring documents", value: "—", icon: FileText },
  { label: "Active loans", value: "—", icon: Wallet },
] as const;

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await auth();
  const name = session?.user.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-semibold">Welcome back, {name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-muted-foreground text-sm">{label}</span>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <span className="text-sm font-medium">Recent activity</span>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center gap-3 py-12 text-center">
            <Inbox className="h-10 w-10" />
            <p className="text-sm">
              Nothing here yet — activity will show up as your team uses Glix Connect.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
