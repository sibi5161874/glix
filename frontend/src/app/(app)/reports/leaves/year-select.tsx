"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function YearSelect({ year, years }: { year: number; years: number[] }): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(value: string): void {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select defaultValue={String(year)} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
