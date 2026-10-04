import { chromium, type Page } from "playwright";
import * as fs from "fs";

interface ScreenData {
  id: string;
  name: string;
  url: string;
  finalUrl: string;
  module: string;
  title: string;
  screenshot: string;
  inputs: any[];
  selects: any[];
  buttons: any[];
  links: any[];
  tables: any[];
  modals: any[];
  tabs: any[];
  bodySnippet: string;
  subScreens?: ScreenData[];
}

async function registerAndLogin(page: Page): Promise<{ email: string; pass: string }> {
  console.log("Registering a fresh tenant session...");
  await page.goto("https://connect.rmd.city/public/register", { waitUntil: "networkidle" });
  const timestamp = Date.now().toString().slice(-5);
  const testEmail = `org_admin_${timestamp}@glix-corp.ae`;
  const testPass = "Secret123!@#";
  const testOrg = `Apex Enterprise ${timestamp}`;
  const testSlug = `apex-corp-${timestamp}`;

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
    { email: testEmail, pass: testPass, org: testOrg, slug: testSlug },
  );

  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  console.log("Logged in! Current URL:", page.url());
  return { email: testEmail, pass: testPass };
}

async function extractScreenData(
  page: Page,
  id: string,
  name: string,
  module: string,
): Promise<ScreenData> {
  const title = await page.title();
  const currentUrl = page.url();
  const screenshotPath = `docs/legacy-analysis/screenshots/${id}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

  const data = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll("input, textarea")).map((el) => {
      const input = el as HTMLInputElement;
      return {
        name: input.name || input.id,
        type: input.type || input.tagName.toLowerCase(),
        id: input.id,
        placeholder: input.placeholder || "",
        required: input.required,
        value: input.type === "password" ? "******" : input.value,
        ariaLabel: input.getAttribute("aria-label") || "",
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
      onclick: el.getAttribute("onclick") || "",
    }));

    const links = Array.from(document.querySelectorAll("a[href]")).map((el) => ({
      text: el.textContent?.trim().replace(/\s+/g, " ") || "",
      href: (el as HTMLAnchorElement).href,
      className: el.className,
    }));

    const tables = Array.from(document.querySelectorAll("table")).map((tbl) => {
      const headers = Array.from(tbl.querySelectorAll("th")).map(
        (th) => th.textContent?.trim() || "",
      );
      const rowCount = tbl.querySelectorAll("tbody tr").length;
      return {
        headers,
        rowCount,
      };
    });

    const modals = Array.from(
      document.querySelectorAll(".modal, [role=dialog], .modal-dialog"),
    ).map((m) => ({
      id: m.id,
      title: m.querySelector(".modal-title, h5, h4")?.textContent?.trim() || "",
      buttons: Array.from(m.querySelectorAll("button")).map((b) => b.textContent?.trim() || ""),
    }));

    const tabs = Array.from(document.querySelectorAll(".nav-tabs, .nav-pills, [role=tablist]")).map(
      (t) => ({
        tabList: Array.from(t.querySelectorAll(".nav-link, [role=tab]")).map(
          (tl) => tl.textContent?.trim() || "",
        ),
      }),
    );

    const bodySnippet = document.body.innerText.slice(0, 2000);

    return {
      inputs,
      selects,
      buttons,
      links,
      tables,
      modals,
      tabs,
      bodySnippet,
    };
  });

  return {
    id,
    name,
    url: currentUrl,
    finalUrl: currentUrl,
    module,
    title,
    screenshot: screenshotPath,
    ...data,
  };
}

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await registerAndLogin(page);

  // Extract all navigation links from the dashboard sidebar
  const navLinks = await page.$$eval(".sidebar a[href], nav a[href], .nav a[href]", (els) =>
    Array.from(new Set(els.map((e) => (e as HTMLAnchorElement).href))).filter(
      (href) => href.startsWith("https://connect.rmd.city/public/") && !href.includes("logout"),
    ),
  );

  console.log("Discovered Navigation Links:", navLinks);

  const screens: ScreenData[] = [];

  // Crawl Dashboard first
  screens.push(await extractScreenData(page, "10-dashboard", "Dashboard Overview", "Dashboard"));

  // Key known modules & candidate paths to crawl
  const knownTargets = [
    {
      id: "11-employees-list",
      name: "Employees Directory",
      module: "Employees",
      url: "https://connect.rmd.city/public/employees",
    },
    {
      id: "12-employees-create",
      name: "Create Employee Form",
      module: "Employees",
      url: "https://connect.rmd.city/public/employees/create",
    },
    {
      id: "13-leaves-list",
      name: "Leave Management",
      module: "Leaves",
      url: "https://connect.rmd.city/public/leaves",
    },
    {
      id: "14-leaves-create",
      name: "Apply / Create Leave",
      module: "Leaves",
      url: "https://connect.rmd.city/public/leaves/create",
    },
    {
      id: "15-loans-list",
      name: "Employee Loans",
      module: "Loans",
      url: "https://connect.rmd.city/public/loans",
    },
    {
      id: "16-loans-create",
      name: "Request / Create Loan",
      module: "Loans",
      url: "https://connect.rmd.city/public/loans/create",
    },
    {
      id: "17-announcements-list",
      name: "Announcements List",
      module: "Announcements",
      url: "https://connect.rmd.city/public/announcements",
    },
    {
      id: "18-announcements-create",
      name: "Create Announcement",
      module: "Announcements",
      url: "https://connect.rmd.city/public/announcements/create",
    },
    {
      id: "19-documents-list",
      name: "Document Automation",
      module: "Documents",
      url: "https://connect.rmd.city/public/documents",
    },
    {
      id: "20-documents-upload",
      name: "Upload Document",
      module: "Documents",
      url: "https://connect.rmd.city/public/documents/upload",
    },
    {
      id: "21-reports",
      name: "Reports & Analytics",
      module: "Reports",
      url: "https://connect.rmd.city/public/reports",
    },
    {
      id: "22-subscription",
      name: "Subscription & Billing",
      module: "Subscription",
      url: "https://connect.rmd.city/public/subscription",
    },
    {
      id: "23-support",
      name: "Support Tickets",
      module: "Support",
      url: "https://connect.rmd.city/public/support",
    },
    {
      id: "24-settings",
      name: "Organization Settings",
      module: "Settings",
      url: "https://connect.rmd.city/public/settings",
    },
    {
      id: "25-letters",
      name: "Official Letters Builder",
      module: "Letters",
      url: "https://connect.rmd.city/public/letters",
    },
    {
      id: "26-departments",
      name: "Departments Management",
      module: "Departments",
      url: "https://connect.rmd.city/public/departments",
    },
    {
      id: "27-designations",
      name: "Designations Management",
      module: "Designations",
      url: "https://connect.rmd.city/public/designations",
    },
    {
      id: "28-checklists",
      name: "Onboarding Checklists",
      module: "Checklists",
      url: "https://connect.rmd.city/public/checklists",
    },
  ];

  // Combine discovered nav links with known targets
  for (const link of navLinks) {
    if (!knownTargets.some((t) => t.url === link)) {
      const slug =
        link.replace("https://connect.rmd.city/public/", "").replace(/\//g, "-") || "home";
      knownTargets.push({
        id: `30-discovered-${slug}`,
        name: `Discovered: ${slug}`,
        module: "Discovered",
        url: link,
      });
    }
  }

  const visitedUrls = new Set<string>(["https://connect.rmd.city/public/dashboard"]);

  for (const target of knownTargets) {
    if (visitedUrls.has(target.url)) continue;
    visitedUrls.add(target.url);

    console.log(`Crawling ${target.name}: ${target.url}`);
    try {
      await page.goto(target.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1000);
      const screenData = await extractScreenData(page, target.id, target.name, target.module);
      screens.push(screenData);

      // Check for any modal triggers or sub-buttons on the page and open them
      const modalBtns = await page.$$('[data-bs-toggle="modal"], [data-toggle="modal"]');
      if (modalBtns.length > 0) {
        console.log(`Found ${modalBtns.length} modal triggers on ${target.name}`);
        for (let i = 0; i < Math.min(modalBtns.length, 3); i++) {
          try {
            await modalBtns[i].click();
            await page.waitForTimeout(600);
            await page.screenshot({
              path: `docs/legacy-analysis/screenshots/${target.id}-modal-${i}.png`,
            });
            // Close modal
            await page.keyboard.press("Escape");
            await page.waitForTimeout(300);
          } catch {
            // Modal ignored
          }
        }
      }
    } catch (e: any) {
      console.warn(`Could not reach ${target.url}: ${e.message}`);
    }
  }

  fs.writeFileSync(
    "docs/legacy-analysis/authenticated-crawl.json",
    JSON.stringify(screens, null, 2),
  );
  console.log(`Authenticated crawl complete! Captured ${screens.length} screens.`);

  await browser.close();
}

main().catch(console.error);
