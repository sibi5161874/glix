import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import type { AnnouncementItem } from "@/lib/announcements";

function PriorityBadge({
  priority,
}: {
  priority: AnnouncementItem["priority"];
}): React.JSX.Element {
  if (priority === "urgent") {
    return (
      <Badge className="flex items-center gap-1 bg-rose-600 text-white">
        <AlertTriangle className="h-3 w-3" /> Urgent
      </Badge>
    );
  }
  if (priority === "high") return <Badge className="bg-amber-600 text-white">High</Badge>;
  return <Badge variant="secondary">Normal</Badge>;
}

export function AnnouncementCard({
  item,
  canWrite,
  onEdit,
  onDelete,
}: {
  item: AnnouncementItem;
  canWrite: boolean;
  onEdit: (item: AnnouncementItem) => void;
  onDelete: (id: string) => void;
}): React.JSX.Element {
  return (
    <Card
      className={
        item.priority === "urgent" ? "border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10" : ""
      }
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={item.priority} />
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {item.authorName || "HR Admin"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(item.publishAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {item.expiresAt && (
              <span className="text-muted-foreground">
                Expires: {new Date(item.expiresAt).toLocaleDateString()}
              </span>
            )}
          </CardDescription>
        </div>

        {canWrite && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label={`Actions for ${item.title}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer gap-2">
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
                className="cursor-pointer gap-2 text-rose-600"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        <p className="text-foreground whitespace-pre-line text-sm leading-relaxed">{item.body}</p>

        {item.attachmentUrl && (
          <div className="pt-2">
            <a
              href={item.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Attached Document / Link
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
