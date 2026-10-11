"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTicketInput } from "@app/shared/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { createTicket } from "@/lib/support";

interface CreateTicketDialogProps {
  accessToken: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTicketDialog({
  accessToken,
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketDialogProps): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(CreateTicketInput),
    defaultValues: {
      category: "technical",
      priority: "medium",
    },
  });

  const category = watch("category");
  const priority = watch("priority");

  const onSubmit = async (data: CreateTicketInput): Promise<void> => {
    try {
      setError(null);
      await createTicket(accessToken, data);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create support ticket");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="text-primary h-5 w-5" />
            Submit a Support Request
          </DialogTitle>
          <DialogDescription>
            Describe the problem, feature request, or billing question. Our engineering & support
            team will respond promptly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g. Need assistance with passport expiry alert"
              {...register("subject")}
            />
            {errors.subject && <p className="text-destructive text-xs">{errors.subject.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Category *</Label>
              <Select
                value={category}
                onValueChange={(val) => setValue("category", val as CreateTicketInput["category"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing & Subscription</SelectItem>
                  <SelectItem value="hr_feature">HR Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-destructive text-xs">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setValue("priority", val as CreateTicketInput["priority"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="body">Description / Details *</Label>
            <textarea
              id="body"
              rows={4}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Provide specific details, steps to reproduce, or context..."
              {...register("body")}
            />
            {errors.body && <p className="text-destructive text-xs">{errors.body.message}</p>}
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Create Ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
