import { auth } from "@/auth";
import { listPlatformTeam } from "@/lib/platform";
import { TeamView } from "./team-view";

export default async function SuperadminTeamPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken || !session.user.isPlatformAdmin) {
    return <p className="text-muted-foreground">Superadmin access required.</p>;
  }

  const team = await listPlatformTeam(session.accessToken);

  return (
    <div className="space-y-6">
      <TeamView accessToken={session.accessToken} initialTeam={team} />
    </div>
  );
}
