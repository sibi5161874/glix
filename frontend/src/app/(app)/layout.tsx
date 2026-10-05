import { auth } from "@/auth";
import { brandConfig } from "@app/shared/config";
import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { UserMenu } from "@/components/app-shell/user-menu";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <aside className="bg-background hidden w-64 flex-col border-r lg:flex">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold">
            {brandConfig.shortName}
          </div>
          <span className="text-sm font-semibold">{brandConfig.name}</span>
        </div>
        <SidebarNav />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-muted-foreground text-sm font-medium">
            {session?.user.orgId ? "Workspace" : ""}
          </span>
          <UserMenu email={session?.user.email} role={session?.user.role} />
        </header>
        <main className="bg-muted/20 flex-1">
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
