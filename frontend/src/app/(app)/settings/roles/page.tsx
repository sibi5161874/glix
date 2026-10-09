import { auth } from "@/auth";
import { getRolePermissionsMatrix } from "@/lib/settings";
import { RolesMatrix } from "./roles-matrix";

export default async function SettingsRolesPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const matrix = await getRolePermissionsMatrix(session.accessToken);

  return (
    <div className="space-y-6">
      <RolesMatrix matrix={matrix} />
    </div>
  );
}
