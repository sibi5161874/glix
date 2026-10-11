import Image from "next/image";
import { auth } from "@/auth";
import { brandConfig } from "@app/shared/config";
import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { UserMenu } from "@/components/app-shell/user-menu";
import { CommandPalette } from "@/components/app-shell/command-palette";
import { MobileNav } from "@/components/app-shell/mobile-nav";

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
          <Image
            src={brandConfig.logo}
            alt={brandConfig.name}
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-semibold">{brandConfig.name}</span>
        </div>
        <SidebarNav />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b px-4">
          <div className="flex items-center gap-2">
            <MobileNav />
            <CommandPalette />
          </div>
          <UserMenu email={session?.user.email} role={session?.user.role} />
        </header>
        <main className="bg-muted/20 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
