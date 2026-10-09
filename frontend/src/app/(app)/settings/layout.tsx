import { SettingsSubnav } from "./settings-subnav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings & Configuration</h1>
        <p className="text-muted-foreground text-sm">
          Manage your organization branding, departmental structures, designations, roles, and
          message templates.
        </p>
      </div>

      <SettingsSubnav />

      {children}
    </div>
  );
}
