/**
 * Default document types seeded on every new organization.
 * Derived from docs/legacy-analysis/02-user-flows.md (Flow 4).
 * Per-org edits override these at runtime.
 */

export interface DocumentTypeSeed {
  code: string;
  name: string;
  requiresExpiry: boolean;
  alertDays: number[];
  retentionDays: number | null;
}

export const defaultDocumentTypes: DocumentTypeSeed[] = [
  {
    code: "passport",
    name: "Passport",
    requiresExpiry: true,
    alertDays: [90, 60, 30],
    retentionDays: 3650, // 10 years
  },
  {
    code: "visa",
    name: "Visa",
    requiresExpiry: true,
    alertDays: [90, 60, 30],
    retentionDays: 1825, // 5 years
  },
  {
    code: "emirates_id",
    name: "Emirates ID",
    requiresExpiry: true,
    alertDays: [90, 60, 30],
    retentionDays: 3650,
  },
  {
    code: "labor_card",
    name: "Labor Card",
    requiresExpiry: true,
    alertDays: [90, 60, 30],
    retentionDays: 1825,
  },
  {
    code: "contract",
    name: "Employment Contract",
    requiresExpiry: false,
    alertDays: [],
    retentionDays: 2555, // 7 years
  },
  {
    code: "degree",
    name: "Degree Certificate",
    requiresExpiry: false,
    alertDays: [],
    retentionDays: null,
  },
  {
    code: "insurance",
    name: "Health Insurance",
    requiresExpiry: true,
    alertDays: [60, 30, 15],
    retentionDays: 1825,
  },
  {
    code: "driving_license",
    name: "Driving License",
    requiresExpiry: true,
    alertDays: [90, 30],
    retentionDays: 3650,
  },
];

export const defaultLeaveTypes = [
  { code: "annual", name: "Annual Leave", daysPerYear: 30, isPaid: true, requiresApproval: true },
  { code: "sick", name: "Sick Leave", daysPerYear: 15, isPaid: true, requiresApproval: true },
  {
    code: "maternity",
    name: "Maternity Leave",
    daysPerYear: 45,
    isPaid: true,
    requiresApproval: true,
  },
  {
    code: "paternity",
    name: "Paternity Leave",
    daysPerYear: 5,
    isPaid: true,
    requiresApproval: true,
  },
  { code: "unpaid", name: "Unpaid Leave", daysPerYear: 0, isPaid: false, requiresApproval: true },
  {
    code: "emergency",
    name: "Emergency Leave",
    daysPerYear: 5,
    isPaid: true,
    requiresApproval: false,
  },
] as const;

export const storageBucket = "org-documents";
export const signedUrlTtlSeconds = 300; // 5 min
export const maxFileSizeMb = 50;
export const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
