"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { updateOrgProfile, type OrgProfile } from "@/lib/settings";

export function ProfileForm({
  initialProfile,
  accessToken,
  canWrite,
}: {
  initialProfile: OrgProfile;
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [profile, setProfile] = useState<OrgProfile>(initialProfile);
  const [name, setName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [phone, setPhone] = useState(profile.phone || "");
  const [industry, setIndustry] = useState(profile.industry || "");
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || "");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!canWrite) return;
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Company name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateOrgProfile(accessToken, {
        name: name.trim(),
        currency: currency.trim().toUpperCase(),
        phone: phone.trim() || null,
        industry: industry.trim() || null,
        logoUrl: logoUrl.trim() || null,
      });
      setProfile(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>
              Update your organization's legal name, currency, and details.
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            Tier: {profile.tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
              <AlertDescription>Company profile updated successfully.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!canWrite || isSaving}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Subdomain / Slug</Label>
              <Input id="slug" value={profile.slug} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="currency">Base Currency (3-letter ISO) *</Label>
              <Input
                id="currency"
                maxLength={3}
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                disabled={!canWrite || isSaving}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry Sector</Label>
              <Input
                id="industry"
                placeholder="e.g. Technology, Retail, Hospitality"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={!canWrite || isSaving}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Official Phone (E.164 format, e.g. +971501234567)</Label>
            <Input
              id="phone"
              placeholder="+971501234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!canWrite || isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="logoUrl">Company Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              placeholder="https://cdn.example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              disabled={!canWrite || isSaving}
            />
          </div>

          {canWrite && (
            <div className="pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving changes..." : "Save Profile"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
