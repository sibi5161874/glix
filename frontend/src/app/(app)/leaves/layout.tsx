import { LeaveSubnav } from "./leave-subnav";

export default function LeaveLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      <LeaveSubnav />
      {children}
    </div>
  );
}
