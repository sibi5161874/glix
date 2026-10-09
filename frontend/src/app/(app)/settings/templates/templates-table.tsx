"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Mail, MessageSquare } from "lucide-react";
import {
  listTemplates,
  saveTemplateOverride,
  updateTemplate,
  deleteTemplateOverride,
  type NotificationTemplateItem,
} from "@/lib/settings";
import type { CreateTemplateInput, UpdateTemplateInput } from "@app/shared/schemas";
import { TemplateDialog } from "./template-dialog";

export function TemplatesTable({
  initialTemplates,
  accessToken,
  canWrite,
}: {
  initialTemplates: NotificationTemplateItem[];
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [templates, setTemplates] = useState<NotificationTemplateItem[]>(initialTemplates);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplateItem | null>(null);

  async function refresh(searchTerm = search, channel = channelFilter) {
    setIsLoading(true);
    try {
      const items = await listTemplates(accessToken, {
        search: searchTerm || undefined,
        channel: channel === "all" ? undefined : (channel as "email" | "whatsapp"),
      });
      setTemplates(items);
    } catch (err) {
      console.error("Failed to load templates", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(val: string) {
    setSearch(val);
    refresh(val, channelFilter);
  }

  function handleChannelChange(val: string) {
    setChannelFilter(val);
    refresh(search, val);
  }

  async function handleSubmit(input: CreateTemplateInput | UpdateTemplateInput) {
    if (editingTemplate && editingTemplate.isCustomOverride) {
      await updateTemplate(accessToken, editingTemplate.id, input as UpdateTemplateInput);
    } else {
      await saveTemplateOverride(accessToken, input as CreateTemplateInput);
    }
    await refresh();
  }

  async function handleDelete(template: NotificationTemplateItem) {
    if (!confirm("Revert this custom template override to platform default?")) return;
    try {
      await deleteTemplateOverride(accessToken, template.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete template override");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search template keys or subjects..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={channelFilter}
            onChange={(e) => handleChannelChange(e.target.value)}
            className="border-input bg-background focus:ring-primary rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
          >
            <option value="all">All Channels</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        {canWrite && (
          <Button
            onClick={() => {
              setEditingTemplate(null);
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Template
          </Button>
        )}
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Template Key</TableHead>
              <TableHead>Subject / Preview</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-32 text-center">
                  {isLoading ? "Loading..." : "No notification templates found."}
                </TableCell>
              </TableRow>
            ) : (
              templates.map((tpl) => (
                <TableRow key={tpl.id}>
                  <TableCell>
                    {tpl.channel === "email" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                        <Mail className="h-3.5 w-3.5" /> Email
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{tpl.key}</TableCell>
                  <TableCell>
                    <div className="text-foreground text-sm font-medium">
                      {tpl.subject || (
                        <span className="text-muted-foreground text-xs italic">No subject</span>
                      )}
                    </div>
                    <div className="text-muted-foreground line-clamp-1 font-mono text-xs">
                      {tpl.body}
                    </div>
                  </TableCell>
                  <TableCell>
                    {tpl.isCustomOverride ? (
                      <Badge className="bg-amber-600 text-[10px] text-white">Custom Override</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Platform Default
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {canWrite && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingTemplate(tpl);
                              setDialogOpen(true);
                            }}
                            className="cursor-pointer gap-2"
                          >
                            <Pencil className="h-4 w-4" />{" "}
                            {tpl.isCustomOverride ? "Edit Override" : "Customize Override"}
                          </DropdownMenuItem>
                          {tpl.isCustomOverride && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(tpl)}
                              className="cursor-pointer gap-2 text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" /> Revert to Default
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TemplateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTemplate(null);
        }}
        template={editingTemplate}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
