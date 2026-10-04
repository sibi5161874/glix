import { chromium } from "playwright";
import * as fs from "fs";

interface ScreenSpec {
  id: string;
  module: string;
  name: string;
  url: string;
}

const allScreensToCrawl: ScreenSpec[] = [
  // Public
  {
    id: "01-landing",
    module: "Public",
    name: "Public Landing Page",
    url: "https://connect.rmd.city/public/",
  },
  {
    id: "02-login",
    module: "Auth",
    name: "Tenant / Employee Login",
    url: "https://connect.rmd.city/public/login",
  },
  {
    id: "03-superadmin-login",
    module: "Auth",
    name: "Super Admin Login",
    url: "https://connect.rmd.city/public/superadmin/login",
  },
  {
    id: "04-register",
    module: "Auth",
    name: "Organization Registration (4-Step Wizard)",
    url: "https://connect.rmd.city/public/register",
  },
  {
    id: "05-privacy",
    module: "Public",
    name: "Privacy Policy",
    url: "https://connect.rmd.city/public/privacy-policy",
  },
  {
    id: "06-terms",
    module: "Public",
    name: "Terms & Conditions",
    url: "https://connect.rmd.city/public/terms-conditions",
  },
  {
    id: "07-refund",
    module: "Public",
    name: "Refund Policy",
    url: "https://connect.rmd.city/public/refund-policy",
  },
  // Authenticated Tenant Portal
  {
    id: "10-dashboard",
    module: "Dashboard",
    name: "Executive Dashboard Overview",
    url: "https://connect.rmd.city/public/dashboard",
  },
  {
    id: "11-employees-list",
    module: "Employees",
    name: "All Employees Directory",
    url: "https://connect.rmd.city/public/employees",
  },
  {
    id: "12-employees-create",
    module: "Employees",
    name: "Add Employee Form",
    url: "https://connect.rmd.city/public/employees/create",
  },
  {
    id: "13-employees-import-export",
    module: "Employees",
    name: "Employees Bulk Import / Export",
    url: "https://connect.rmd.city/public/employees/import-export",
  },
  {
    id: "14-leaves-requests",
    module: "Leave Management",
    name: "Leave Requests & Approvals",
    url: "https://connect.rmd.city/public/leaves/requests",
  },
  {
    id: "15-leaves-balances",
    module: "Leave Management",
    name: "Employee Leave Balances",
    url: "https://connect.rmd.city/public/leaves/balances",
  },
  {
    id: "16-leaves-types",
    module: "Leave Management",
    name: "Leave Types Configuration",
    url: "https://connect.rmd.city/public/leaves/types",
  },
  {
    id: "17-holidays",
    module: "Leave Management",
    name: "Public & Organization Holidays",
    url: "https://connect.rmd.city/public/holidays",
  },
  {
    id: "18-leaves-calendar",
    module: "Leave Management",
    name: "Leave Calendar View",
    url: "https://connect.rmd.city/public/leaves/calendar",
  },
  {
    id: "19-loans",
    module: "Payroll & Loans",
    name: "Employee Loans & Advances",
    url: "https://connect.rmd.city/public/payroll/loans",
  },
  {
    id: "20-announcements",
    module: "Announcements",
    name: "Company Announcements & Bulletins",
    url: "https://connect.rmd.city/public/announcements",
  },
  {
    id: "21-document-types",
    module: "Documents",
    name: "Document Categories & Types",
    url: "https://connect.rmd.city/public/documents/types",
  },
  {
    id: "22-documents-all",
    module: "Documents",
    name: "All Documents & Expiry Tracking",
    url: "https://connect.rmd.city/public/documents",
  },
  {
    id: "23-reports-overview",
    module: "Reports",
    name: "Reports Overview & Summary",
    url: "https://connect.rmd.city/public/reports",
  },
  {
    id: "24-reports-employees",
    module: "Reports",
    name: "Employee Demographics Report",
    url: "https://connect.rmd.city/public/reports/employees",
  },
  {
    id: "25-reports-leaves",
    module: "Reports",
    name: "Leave Utilization Report",
    url: "https://connect.rmd.city/public/reports/leaves",
  },
  {
    id: "26-reports-documents",
    module: "Reports",
    name: "Document Expiries Report",
    url: "https://connect.rmd.city/public/reports/documents",
  },
  {
    id: "27-reports-loans",
    module: "Reports",
    name: "Loan Balances & Deductions Report",
    url: "https://connect.rmd.city/public/reports/loans",
  },
  {
    id: "28-subscription",
    module: "Billing",
    name: "Subscription & Billing Plans",
    url: "https://connect.rmd.city/public/settings/subscription",
  },
  {
    id: "29-support",
    module: "Support",
    name: "Help & Support Tickets",
    url: "https://connect.rmd.city/public/support",
  },
  {
    id: "30-settings-profile",
    module: "Settings",
    name: "Organization Profile & Branding",
    url: "https://connect.rmd.city/public/settings/profile",
  },
  {
    id: "31-departments",
    module: "Settings",
    name: "Department Hierarchy",
    url: "https://connect.rmd.city/public/departments",
  },
  {
    id: "32-designations",
    module: "Settings",
    name: "Designations & Job Titles",
    url: "https://connect.rmd.city/public/designations",
  },
  {
    id: "33-roles-permissions",
    module: "Settings",
    name: "Roles & Permission Access Matrix",
    url: "https://connect.rmd.city/public/settings/roles",
  },
  {
    id: "34-notification-templates",
    module: "Settings",
    name: "Notification Templates & Triggers",
    url: "https://connect.rmd.city/public/settings/templates",
  },
];

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Starting comprehensive crawl...");

  // Register and login to get tenant session
  await page.goto("https://connect.rmd.city/public/register", { waitUntil: "networkidle" });
  const timestamp = Date.now().toString().slice(-5);
  const adminEmail = `crawler_admin_${timestamp}@glix-corp.ae`;
  const adminPass = "Secret123!@#";
  const orgName = `Apex Global ${timestamp}`;
  const orgSlug = `apex-global-${timestamp}`;

  await page.evaluate(
    ({ email, pass, org, slug }) => {
      const wizardEl = document.querySelector("[x-data]") as any;
      if (wizardEl && wizardEl._x_dataStack) {
        const data = wizardEl._x_dataStack[0];
        data.formData.name = "Apex Admin";
        data.formData.email = email;
        data.formData.password = pass;
        data.formData.password_confirmation = pass;
        data.formData.org_name = org;
        data.formData.org_slug = slug;
        data.formData.org_currency = "AED";
        data.formData.org_phone = "+971 50 888 9999";
        data.formData.plan_id = "1";
        data.currentStep = 4;
      }
      (document.querySelector('input[name="name"]') as HTMLInputElement).value = "Apex Admin";
      (document.querySelector('input[name="email"]') as HTMLInputElement).value = email;
      (document.querySelector('input[name="password"]') as HTMLInputElement).value = pass;
      (document.querySelector('input[name="password_confirmation"]') as HTMLInputElement).value =
        pass;
      (document.querySelector('input[name="org_name"]') as HTMLInputElement).value = org;
      (document.querySelector('input[name="org_slug"]') as HTMLInputElement).value = slug;
      (document.querySelector('input[name="org_phone"]') as HTMLInputElement).value =
        "+971 50 888 9999";
      (document.querySelector('input[name="plan_id"]') as HTMLInputElement).value = "1";
    },
    { email: adminEmail, pass: adminPass, org: orgName, slug: orgSlug },
  );

  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  const results: any[] = [];

  for (const screen of allScreensToCrawl) {
    console.log(`Crawling [${screen.module}] ${screen.name}: ${screen.url}`);
    try {
      const resp = await page.goto(screen.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(800);

      const title = await page.title();
      const finalUrl = page.url();
      const screenshotPath = `docs/legacy-analysis/screenshots/${screen.id}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const pageData = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll("input, textarea")).map((el) => {
          const input = el as HTMLInputElement;
          return {
            name: input.name || input.id,
            type: input.type || input.tagName.toLowerCase(),
            id: input.id,
            placeholder: input.placeholder || "",
            required: input.required,
            value: input.type === "password" ? "******" : input.value,
            checked: input.checked,
          };
        });

        const selects = Array.from(document.querySelectorAll("select")).map((el) => {
          const select = el as HTMLSelectElement;
          return {
            name: select.name || select.id,
            id: select.id,
            required: select.required,
            options: Array.from(select.options).map((o) => ({
              value: o.value,
              text: o.text.trim(),
              selected: o.selected,
            })),
          };
        });

        const buttons = Array.from(
          document.querySelectorAll("button, input[type=submit], .btn, [role=button]"),
        ).map((el) => ({
          text: el.textContent?.trim().replace(/\s+/g, " ") || "",
          type: el.getAttribute("type") || "button",
          className: el.className,
          disabled: (el as HTMLButtonElement).disabled || false,
        }));

        const links = Array.from(document.querySelectorAll("a[href]")).map((el) => ({
          text: el.textContent?.trim().replace(/\s+/g, " ") || "",
          href: (el as HTMLAnchorElement).href,
        }));

        const tables = Array.from(document.querySelectorAll("table")).map((tbl) => {
          const headers = Array.from(tbl.querySelectorAll("th")).map(
            (th) => th.textContent?.trim() || "",
          );
          const rows = Array.from(tbl.querySelectorAll("tbody tr")).map((tr) =>
            Array.from(tr.querySelectorAll("td")).map((td) => td.textContent?.trim() || ""),
          );
          return { headers, rowsCount: rows.length, sampleRows: rows.slice(0, 3) };
        });

        const modals = Array.from(document.querySelectorAll(".modal, [role=dialog]")).map((m) => {
          const title = m.querySelector(".modal-title, h5, h4, h3")?.textContent?.trim() || "";
          const modalInputs = Array.from(m.querySelectorAll("input, select, textarea")).map(
            (i) => ({
              name: (i as any).name || (i as any).id,
              type: (i as any).type || i.tagName.toLowerCase(),
              placeholder: (i as any).placeholder || "",
              required: (i as any).required || false,
            }),
          );
          const modalButtons = Array.from(m.querySelectorAll("button, .btn")).map(
            (b) => b.textContent?.trim() || "",
          );
          return { id: m.id, title, inputs: modalInputs, buttons: modalButtons };
        });

        const headings = Array.from(
          document.querySelectorAll("h1, h2, h3, h4, h5, .page-title, .card-title"),
        ).map((h) => h.textContent?.trim().replace(/\s+/g, " "));

        const bodySnippet = document.body.innerText.slice(0, 3000);

        return {
          inputs,
          selects,
          buttons,
          links,
          tables,
          modals,
          headings,
          bodySnippet,
        };
      });

      // Check for modals to trigger & screenshot
      const modalBtns = await page.$$('[data-bs-toggle="modal"], [data-toggle="modal"]');
      if (modalBtns.length > 0) {
        for (let i = 0; i < Math.min(modalBtns.length, 2); i++) {
          try {
            await modalBtns[i].click();
            await page.waitForTimeout(500);
            await page.screenshot({
              path: `docs/legacy-analysis/screenshots/${screen.id}-modal-${i + 1}.png`,
            });
            await page.keyboard.press("Escape");
            await page.waitForTimeout(300);
          } catch {
            // Ignored modal backdrop error
          }
        }
      }

      results.push({
        ...screen,
        finalUrl,
        title,
        status: resp?.status(),
        screenshot: screenshotPath,
        ...pageData,
      });
    } catch (e: any) {
      console.warn(`Error crawling ${screen.name}: ${e.message}`);
    }
  }

  fs.writeFileSync(
    "docs/legacy-analysis/comprehensive-crawl.json",
    JSON.stringify(results, null, 2),
  );
  console.log(`Comprehensive crawl complete! Successfully captured ${results.length} screens.`);

  await browser.close();
}

main().catch(console.error);
