import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, CreditCard, Ticket, TrendingUp } from "lucide-react";

const KPIS = [
  { label: "Organizations", value: "—", icon: Building2 },
  { label: "MRR", value: "—", icon: TrendingUp },
  { label: "Open tickets", value: "—", icon: Ticket },
  { label: "Active subscriptions", value: "—", icon: CreditCard },
] as const;

export default function SuperadminDashboardPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Platform overview</h1>
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
      <p className="text-muted-foreground text-sm">
        Organization management, billing, and CMS tools arrive in Phase 10 (Superadmin Platform).
      </p>
    </div>
  );
}
