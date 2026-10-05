"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterOrgInput } from "@app/shared/schemas";
import { brandConfig } from "@app/shared/config";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = ["Your details", "Organization", "Plan", "Review"] as const;

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterOrgInput>({
    resolver: zodResolver(RegisterOrgInput),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      orgName: "",
      orgSlug: "",
      currency: "AED",
      planSlug: "free",
    },
  });

  const stepFields: Record<number, (keyof RegisterOrgInput)[]> = {
    0: ["fullName", "email", "password"],
    1: ["orgName", "orgSlug", "phone", "currency", "industry"],
    2: ["planSlug"],
    3: [],
  };

  async function goNext(): Promise<void> {
    const valid = await form.trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack(): void {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: RegisterOrgInput): Promise<void> {
    setIsSubmitting(true);
    try {
      await apiFetch("/v1/auth/register", { method: "POST", body: JSON.stringify(values) });
      const result = await signIn("credentials", {
        identifier: values.email,
        secret: values.password,
        redirect: false,
      });
      if (!result || result.error) {
        toast.success("Account created — please sign in.");
        router.push("/login");
        return;
      }
      toast.success(`Welcome to ${brandConfig.name}, ${values.fullName}!`);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your workspace</CardTitle>
          <CardDescription>
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </CardDescription>
          <div className="flex gap-1.5 pt-2">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === STEPS.length - 1) void form.handleSubmit(onSubmit)(e);
                else void goNext();
              }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" autoComplete="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="jane@company.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="orgName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="orgSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subdomain / slug</FormLabel>
                        <FormControl>
                          <Input placeholder="acme" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+971501234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Construction" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <FormField
                  control={form.control}
                  name="planSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Starter — Free, up to 25 employees</SelectItem>
                          <SelectItem value="pro">
                            Growth — Pro tier, up to 250 employees
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {step === 3 && (
                <dl className="space-y-2 text-sm">
                  {(
                    [
                      ["Full name", form.getValues("fullName")],
                      ["Email", form.getValues("email")],
                      ["Organization", form.getValues("orgName")],
                      ["Slug", form.getValues("orgSlug")],
                      ["Plan", form.getValues("planSlug")],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b py-1.5">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {step === STEPS.length - 1
                    ? isSubmitting
                      ? "Creating..."
                      : "Complete signup"
                    : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
