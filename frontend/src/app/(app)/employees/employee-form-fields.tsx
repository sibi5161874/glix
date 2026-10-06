"use client";

import type { Control, FieldPath } from "react-hook-form";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "@app/shared/schemas";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type EmployeeFormValues = CreateEmployeeInput & { status?: UpdateEmployeeInput["status"] };

export const NONE = "__none__";

export function TextField({
  control,
  name,
  label,
  type = "text",
}: {
  control: Control<EmployeeFormValues>;
  name: FieldPath<EmployeeFormValues>;
  label: string;
  type?: string;
}): React.JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "number" ? (
              <Input
                type="number"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={(field.value as number | undefined) ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            ) : (
              <Input type={type} {...field} value={(field.value as string) ?? ""} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function EnumField({
  control,
  name,
  label,
  options,
}: {
  control: Control<EmployeeFormValues>;
  name: FieldPath<EmployeeFormValues>;
  label: string;
  options: string[];
}): React.JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value as string}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function LookupField({
  control,
  name,
  label,
  options,
}: {
  control: Control<EmployeeFormValues>;
  name: FieldPath<EmployeeFormValues>;
  label: string;
  options: { value: string; label: string }[];
}): React.JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(v === NONE ? undefined : v)}
            value={(field.value as string) ?? NONE}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={NONE}>None</SelectItem>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
