"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  ShieldAlert,
  Globe,
  FileText,
  Server,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePlatformSetting, type PlatformSettingItem } from "@/lib/platform";

interface SettingsViewProps {
  accessToken: string;
  initialSettings: PlatformSettingItem[];
}

export function SettingsView({
  accessToken,
  initialSettings,
}: SettingsViewProps): React.JSX.Element {
  const getInitialVal = (key: string, field: string, fallback: string): string => {
    const s = initialSettings.find((item) => item.key === key);
    return s?.value && typeof s.value === "object" && field in s.value
      ? String((s.value as Record<string, unknown>)[field])
      : fallback;
  };

  const [landingHeadline, setLandingHeadline] = useState(
    getInitialVal("landing.hero", "headline", "Enterprise HR & Document Platform"),
  );
  const [landingTagline, setLandingTagline] = useState(
    getInitialVal(
      "landing.hero",
      "tagline",
      "Multi-tenant workforce management for the modern GCC enterprise",
    ),
  );
  const [termsPolicy, setTermsPolicy] = useState(
    getInitialVal(
      "legal.terms",
      "content",
      "Standard enterprise SaaS terms of service and acceptable use agreement.",
    ),
  );
  const [smtpHost, setSmtpHost] = useState(
    getInitialVal("integrations.smtp", "host", "smtp.sendgrid.net"),
  );
  const [smtpPort, setSmtpPort] = useState(getInitialVal("integrations.smtp", "port", "587"));

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const handleSave = async (key: string, payload: Record<string, unknown>): Promise<void> => {
    try {
      setSavingKey(key);
      await updatePlatformSetting(accessToken, key, payload);
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2500);
    } catch {
      // Handled
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Settings className="text-primary h-6 w-6" />
          Platform Global Configuration
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage landing CMS, legal policy documents, platform defaults, and gateway credentials.
        </p>
      </div>

      <Tabs defaultValue="landing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:w-[480px]">
          <TabsTrigger value="landing" className="gap-1.5">
            <Globe className="h-4 w-4" /> Landing CMS
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-1.5">
            <FileText className="h-4 w-4" /> Legal Policies
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5">
            <Server className="h-4 w-4" /> Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="landing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Public Landing Page Content</CardTitle>
              <CardDescription>
                Hero headlines, value propositions, and public marketing copy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Hero Headline</Label>
                <Input
                  value={landingHeadline}
                  onChange={(e) => setLandingHeadline(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tagline / Subtext</Label>
                <Input value={landingTagline} onChange={(e) => setLandingTagline(e.target.value)} />
              </div>
              <Button
                onClick={() =>
                  handleSave("landing.hero", { headline: landingHeadline, tagline: landingTagline })
                }
                disabled={savingKey === "landing.hero"}
                className="gap-1.5"
              >
                {savingKey === "landing.hero" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : savedKey === "landing.hero" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savedKey === "landing.hero" ? "Saved!" : "Save Landing Copy"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Legal Policies & Terms of Service</CardTitle>
              <CardDescription>
                Tenant service level agreements, privacy clauses, and legal disclosures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Terms & Conditions Policy</Label>
                <textarea
                  rows={6}
                  value={termsPolicy}
                  onChange={(e) => setTermsPolicy(e.target.value)}
                  className="border-input bg-background w-full rounded-md border p-3 text-xs leading-relaxed"
                />
              </div>
              <Button
                onClick={() => handleSave("legal.terms", { content: termsPolicy })}
                disabled={savingKey === "legal.terms"}
                className="gap-1.5"
              >
                {savingKey === "legal.terms" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : savedKey === "legal.terms" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savedKey === "legal.terms" ? "Saved!" : "Save Legal Terms"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Gateways & Dispatchers</CardTitle>
              <CardDescription>
                SMTP delivery, payment gateways, and WhatsApp API configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>SMTP Host</Label>
                  <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>SMTP Port</Label>
                  <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                </div>
              </div>
              <div className="bg-muted/40 flex items-center gap-2 rounded-md border p-3 text-xs">
                <ShieldAlert className="text-primary h-4 w-4 shrink-0" />
                <span>Sensitive API secrets are stored securely in environment variables.</span>
              </div>
              <Button
                onClick={() => handleSave("integrations.smtp", { host: smtpHost, port: smtpPort })}
                disabled={savingKey === "integrations.smtp"}
                className="gap-1.5"
              >
                {savingKey === "integrations.smtp" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : savedKey === "integrations.smtp" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savedKey === "integrations.smtp" ? "Saved!" : "Save Gateway Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
