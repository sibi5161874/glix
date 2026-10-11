"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { brandConfig } from "@app/shared/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/app-shell/sidebar-nav";

export function MobileNav(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-14 flex-row items-center gap-2 space-y-0 border-b px-4">
          <Image
            src={brandConfig.logo}
            alt={brandConfig.name}
            width={24}
            height={24}
            className="rounded-md"
          />
          <SheetTitle className="text-sm font-semibold">{brandConfig.name}</SheetTitle>
        </SheetHeader>
        <div className="py-2">
          <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}
