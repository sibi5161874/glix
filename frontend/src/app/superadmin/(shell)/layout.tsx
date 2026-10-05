import { auth } from "@/auth";
import { brandConfig } from "@app/shared/config";
import { UserMenu } from "@/components/app-shell/user-menu";
import { ShieldAlert } from "lucide-react";

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-accent text-accent-foreground flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          <span className="text-sm font-semibold">{brandConfig.name} — Platform Control</span>
        </div>
        <UserMenu email={session?.user.email} role="super_admin" />
      </header>
      <main className="bg-muted/20 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
