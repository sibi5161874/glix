import { chromium, type Page, type Response } from "playwright";
import * as fs from "fs";

interface CapturedApi {
  url: string;
  method: string;
  status: number;
  contentType: string;
  body: any;
}

const capturedApis: CapturedApi[] = [];

function setupApiInterceptor(page: Page) {
  page.on("response", async (response: Response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] || "";
    if (
      (contentType.includes("application/json") ||
        url.includes("/api/") ||
        url.includes("/json")) &&
      !url.includes("google") &&
      !url.includes("analytics")
    ) {
      try {
        const body = await response.json().catch(() => null);
        if (body) {
          capturedApis.push({
            url,
            method: response.request().method(),
            status: response.status(),
            contentType,
            body,
          });
        }
      } catch {
        // ignore parsing error
      }
    }
  });
}

async function main() {
  console.log("🚀 Starting Staff & Viewer End-to-End Test and API Capture...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  // 1. Admin Context: Register Tenant Organization
  console.log("1️⃣ Registering fresh tenant in Admin Context...");
  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const adminPage = await adminContext.newPage();
  setupApiInterceptor(adminPage);

  await adminPage.goto("https://connect.rmd.city/public/register", { waitUntil: "networkidle" });
  const timestamp = Date.now().toString().slice(-4);
  const adminEmail = `org_lead_${timestamp}@glix-hr.ae`;
  const adminPass = "GlixPassword123!@";
  const orgName = `Oasis Tech ${timestamp}`;
  const orgSlug = `oasis-tech-${timestamp}`;

  await adminPage.evaluate(
    ({ email, pass, org, slug }) => {
      const wizardEl = document.querySelector("[x-data]") as any;
      if (wizardEl && wizardEl._x_dataStack) {
        const data = wizardEl._x_dataStack[0];
        data.formData.name = "Fatima Lead";
        data.formData.email = email;
        data.formData.password = pass;
        data.formData.password_confirmation = pass;
        data.formData.org_name = org;
        data.formData.org_slug = slug;
        data.formData.org_currency = "AED";
        data.formData.org_phone = "+971 52 111 2222";
        data.formData.plan_id = "1";
        data.currentStep = 4;
      }
      (document.querySelector('input[name="name"]') as HTMLInputElement).value = "Fatima Lead";
      (document.querySelector('input[name="email"]') as HTMLInputElement).value = email;
      (document.querySelector('input[name="password"]') as HTMLInputElement).value = pass;
      (document.querySelector('input[name="password_confirmation"]') as HTMLInputElement).value =
        pass;
      (document.querySelector('input[name="org_name"]') as HTMLInputElement).value = org;
      (document.querySelector('input[name="org_slug"]') as HTMLInputElement).value = slug;
      (document.querySelector('input[name="org_phone"]') as HTMLInputElement).value =
        "+971 52 111 2222";
      (document.querySelector('input[name="plan_id"]') as HTMLInputElement).value = "1";
    },
    { email: adminEmail, pass: adminPass, org: orgName, slug: orgSlug },
  );

  await Promise.all([
    adminPage.waitForNavigation({ timeout: 20000 }).catch(() => {}),
    adminPage.click('button[type="submit"]'),
  ]);

  console.log("Logged in as Admin. Landed on:", adminPage.url());

  // 2. Add an Employee with EMP-001 & DOB
  console.log("2️⃣ Navigating to Create Employee...");
  await adminPage.goto("https://connect.rmd.city/public/employees/create", {
    waitUntil: "networkidle",
  });
  await adminPage.waitForTimeout(1000);

  const empCode = `EMP-${timestamp}`;
  const empEmail = `omar.staff.${timestamp}@glix-hr.ae`;
  const empDob = "1992-08-20";

  await adminPage.screenshot({
    path: "docs/legacy-analysis/screenshots/emp-create-form.png",
    fullPage: true,
  });

  await adminContext.close();

  // 3. Fresh Context: Test Dual Login with Employee Code
  console.log("3️⃣ Testing Employee Code Login surface (/login) in clean context...");
  const empContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const empPage = await empContext.newPage();
  setupApiInterceptor(empPage);

  await empPage.goto("https://connect.rmd.city/public/login", { waitUntil: "networkidle" });
  await empPage.fill('input[name="login"]', empCode);
  await empPage.fill('input[name="password"]', empDob);
  await empPage.screenshot({
    path: "docs/legacy-analysis/screenshots/emp-code-login-screen.png",
    fullPage: true,
  });
  await empContext.close();

  // 4. Superadmin Context: Extract Email & WhatsApp template contents
  console.log("4️⃣ Extracting Notification Template bodies from Superadmin...");
  const saContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const saPage = await saContext.newPage();
  setupApiInterceptor(saPage);

  await saPage.goto("https://connect.rmd.city/public/superadmin/login", {
    waitUntil: "networkidle",
  });
  await saPage.fill('input[name="email"]', "superadmin@glix.ae");
  await saPage.fill('input[name="password"]', "Connect1@");
  await saPage.click('button[type="submit"]');
  await saPage.waitForTimeout(2000);

  // Visit Email Templates
  console.log("Visiting Email Templates...");
  await saPage.goto("https://connect.rmd.city/public/superadmin/email-templates", {
    waitUntil: "networkidle",
  });
  const emailTemplates = await saPage.evaluate(() => {
    return Array.from(document.querySelectorAll("table tbody tr, .card, .template-item")).map(
      (el) => el.textContent?.trim().replace(/\s+/g, " ") || "",
    );
  });

  // Visit WhatsApp Templates
  console.log("Visiting WhatsApp Templates...");
  await saPage.goto("https://connect.rmd.city/public/superadmin/whatsapp-templates", {
    waitUntil: "networkidle",
  });
  const whatsappTemplates = await saPage.evaluate(() => {
    return Array.from(document.querySelectorAll("table tbody tr, .card, .template-item")).map(
      (el) => el.textContent?.trim().replace(/\s+/g, " ") || "",
    );
  });

  await saContext.close();

  // Save staff and template analysis
  const staffAnalysis = {
    testedAt: new Date().toISOString(),
    empCode,
    empEmail,
    empDob,
    capturedApisCount: capturedApis.length,
    capturedApisSample: capturedApis.slice(0, 10),
    emailTemplates,
    whatsappTemplates,
  };

  fs.writeFileSync(
    "docs/legacy-analysis/staff-and-templates.json",
    JSON.stringify(staffAnalysis, null, 2),
    "utf-8",
  );

  console.log(
    "✅ Saved staff & template findings to docs/legacy-analysis/staff-and-templates.json!",
  );
  await browser.close();
}

main().catch(console.error);
