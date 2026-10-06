"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateEmployeeInput, UpdateEmployeeInput } from "@app/shared/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  createEmployee,
  updateEmployee,
  type EmployeeListItem,
  type Lookup,
} from "@/lib/employees";
import { ApiError } from "@/lib/api";
import { TextField, EnumField, LookupField, type EmployeeFormValues } from "./employee-form-fields";

export function EmployeeForm({
  mode,
  employee,
  departments,
  designations,
}: {
  mode: "create" | "edit";
  employee?: EmployeeListItem;
  departments: Lookup[];
  designations: Lookup[];
}): React.JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = mode === "create" ? CreateEmployeeInput : UpdateEmployeeInput;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeCode: employee?.employeeCode ?? "",
      firstName: employee?.firstName ?? "",
      lastName: employee?.lastName ?? "",
      email: employee?.email ?? "",
      phone: employee?.phone ?? undefined,
      dob: employee?.dob ?? undefined,
      nationality: employee?.nationality ?? undefined,
      departmentId: employee?.departmentId ?? undefined,
      designationId: employee?.designationId ?? undefined,
      joiningDate: employee?.joiningDate ?? "",
      employmentType:
        (employee?.employmentType as EmployeeFormValues["employmentType"]) ?? "full_time",
      basicSalary: employee ? Number(employee.basicSalary) : 0,
      bankAccount: employee?.bankAccount ?? undefined,
      iban: employee?.iban ?? undefined,
      // `status` must be entirely absent from the defaultValues object in create
      // mode — CreateEmployeeInput.strict() rejects it as an unrecognized key
      // even when its value is `undefined`, since RHF still submits the key.
      ...(mode === "edit"
        ? { status: (employee?.status as EmployeeFormValues["status"]) ?? undefined }
        : {}),
    },
  });

  async function onSubmit(values: EmployeeFormValues): Promise<void> {
    if (!session?.accessToken) return;
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const created = await createEmployee(session.accessToken, values);
        toast.success(`${created.firstName} ${created.lastName} was added.`);
        router.push(`/employees/${created.id}`);
      } else if (employee) {
        await updateEmployee(session.accessToken, employee.id, values);
        toast.success("Employee updated.");
        router.push(`/employees/${employee.id}`);
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <TextField control={form.control} name="employeeCode" label="Employee code" />
            <TextField control={form.control} name="firstName" label="First name" />
            <TextField control={form.control} name="lastName" label="Last name" />
            <TextField control={form.control} name="email" label="Email" type="email" />
            <TextField control={form.control} name="phone" label="Phone" />
            <TextField control={form.control} name="dob" label="Date of birth" type="date" />
            <TextField control={form.control} name="nationality" label="Nationality" />
            <TextField control={form.control} name="joiningDate" label="Joining date" type="date" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <LookupField
              control={form.control}
              name="departmentId"
              label="Department"
              options={departments.map((d) => ({ value: d.id, label: d.name ?? "" }))}
            />
            <LookupField
              control={form.control}
              name="designationId"
              label="Designation"
              options={designations.map((d) => ({ value: d.id, label: d.title ?? "" }))}
            />
            <EnumField
              control={form.control}
              name="employmentType"
              label="Employment type"
              options={["full_time", "part_time", "contract"]}
            />
            <TextField
              control={form.control}
              name="basicSalary"
              label="Basic salary"
              type="number"
            />
            {mode === "edit" && (
              <EnumField
                control={form.control}
                name="status"
                label="Status"
                options={["active", "probation", "on_leave", "terminated"]}
              />
            )}
            <TextField control={form.control} name="bankAccount" label="Bank account" />
            <TextField control={form.control} name="iban" label="IBAN" />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Add employee" : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
