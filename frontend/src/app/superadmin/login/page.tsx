"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

const SuperadminLoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type SuperadminLoginInput = z.infer<typeof SuperadminLoginInput>;

export default function SuperadminLoginPage(): React.JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SuperadminLoginInput>({
    resolver: zodResolver(SuperadminLoginInput),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SuperadminLoginInput): Promise<void> {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      identifier: values.email,
      secret: values.password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (!result || result.error) {
      toast.error("Couldn't sign in.");
      return;
    }
    router.push("/superadmin/dashboard");
    router.refresh();
  }

  return (
    <div className="bg-accent flex min-h-screen items-center justify-center p-6">
      <Card className="border-accent-foreground/10 bg-background w-full max-w-sm">
        <CardHeader className="space-y-2">
          <div className="text-accent flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <CardTitle className="text-lg">Platform Admin</CardTitle>
          </div>
          <CardDescription>Restricted to Glix platform staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="username" {...field} />
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
                      <Input type="password" autoComplete="current-password" {...field} />
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
        </CardContent>
      </Card>
    </div>
  );
}
