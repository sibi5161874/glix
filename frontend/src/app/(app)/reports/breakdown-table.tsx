import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BreakdownRow } from "@/lib/reports";

export function BreakdownTable({
  title,
  rows,
  labelHeader = "Label",
}: {
  title: string;
  rows: BreakdownRow[];
  labelHeader?: string;
}): React.JSX.Element {
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labelHeader}</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground text-center">
                No data.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell className="text-right">{row.count}</TableCell>
                <TableCell className="text-right">
                  {total > 0 ? Math.round((row.count / total) * 100) : 0}%
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
