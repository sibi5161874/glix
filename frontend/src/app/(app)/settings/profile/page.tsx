import { auth } from "@/auth";
import { getOrgProfile } from "@/lib/settings";
import { ProfileForm } from "./profile-form";

export default async function SettingsProfilePage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const profile = await getOrgProfile(session.accessToken);
  const canWrite = session.user.role === "org_admin";

  return (
    <div className="space-y-6">
      <ProfileForm initialProfile={profile} accessToken={session.accessToken} canWrite={canWrite} />
    </div>
  );
}
