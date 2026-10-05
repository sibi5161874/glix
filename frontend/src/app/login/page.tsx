"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput } from "@app/shared/schemas";
import { brandConfig } from "@app/shared/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginInput),
    defaultValues: { identifier: "", secret: "" },
  });

  async function onSubmit(values: LoginInput): Promise<void> {
    setIsSubmitting(true);
    const result = await signIn("credentials", { ...values, redirect: false });
    setIsSubmitting(false);

    if (!result || result.error) {
      toast.error("Couldn't sign in. Check your credentials and try again.");
      return;
    }
    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="bg-accent text-accent-foreground hidden flex-col justify-between p-12 lg:flex lg:w-1/2">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold">
            {brandConfig.shortName}
          </div>
          <span className="text-lg font-semibold">{brandConfig.name}</span>
        </div>
        <p className="max-w-md text-3xl font-semibold tracking-tight">{brandConfig.tagline}</p>
        <p className="text-accent-foreground/70 text-sm">
          © {new Date().getFullYear()} {brandConfig.name}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <p className="text-muted-foreground text-sm">
              Use your email, or your employee code and date of birth.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or employee code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@company.com or EMP-001"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password or date of birth</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have a workspace?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-center text-sm">
            <Link href="/superadmin/login" className="text-muted-foreground hover:underline">
              Platform admin sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
