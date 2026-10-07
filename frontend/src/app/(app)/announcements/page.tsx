import { auth } from "@/auth";
import { AnnouncementsTable } from "./announcements-table";
import { listAnnouncements } from "@/lib/announcements";

export default async function AnnouncementsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const { items: announcements } = await listAnnouncements(session.accessToken, { limit: 50 });

  const canWrite = session.user.role === "org_admin" || session.user.role === "org_staff";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Company Announcements</h1>
        <p className="text-muted-foreground text-sm">
          Stay informed with important updates, policy notices, and company-wide bulletins.
        </p>
      </div>

      <AnnouncementsTable
        initialAnnouncements={announcements}
        accessToken={session.accessToken}
        canWrite={canWrite}
      />
    </div>
  );
}
