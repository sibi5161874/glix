import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <FileQuestion className="text-muted-foreground h-10 w-10" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Page Not Found</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        The page you are looking for doesn&apos;t exist or has been moved to another URL.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
