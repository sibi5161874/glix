import { auth } from "@/auth";
import { listPlatformSettings } from "@/lib/platform";
import { SettingsView } from "./settings-view";

export default async function SuperadminSettingsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken || !session.user.isPlatformAdmin) {
    return <p className="text-muted-foreground">Superadmin access required.</p>;
  }

  const settings = await listPlatformSettings(session.accessToken);

  return (
    <div className="space-y-6">
      <SettingsView accessToken={session.accessToken} initialSettings={settings} />
    </div>
  );
}
