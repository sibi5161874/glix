"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlatformTeamInput } from "@app/shared/schemas";
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
import { UserPlus, Loader2 } from "lucide-react";
import { addPlatformTeamMember } from "@/lib/platform";

interface AddMemberDialogProps {
  accessToken: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMemberDialog({
  accessToken,
  isOpen,
  onClose,
  onSuccess,
}: AddMemberDialogProps): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlatformTeamInput>({
    resolver: zodResolver(PlatformTeamInput),
    defaultValues: {
      role: "admin",
    },
  });

  const role = watch("role");

  const onSubmit = async (data: PlatformTeamInput): Promise<void> => {
    try {
      setError(null);
      await addPlatformTeamMember(accessToken, data);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add platform user");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="text-primary h-5 w-5" />
            Add Platform Team Member
          </DialogTitle>
          <DialogDescription>
            Grant superadmin or platform support access to a team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" placeholder="Sarah Connor" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-destructive text-xs">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="sarah@platform.test"
              {...register("email")}
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Platform Role *</Label>
            <Select
              value={role}
              onValueChange={(val) => setValue("role", val as PlatformTeamInput["role"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Platform Owner (Full Access)</SelectItem>
                <SelectItem value="admin">Platform Admin</SelectItem>
                <SelectItem value="support">Support Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Team Member"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
