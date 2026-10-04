import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Register & login
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

  // Extract all dropdown menus and all links inside them
  const navTree = await page.evaluate(() => {
    const dropdowns = Array.from(document.querySelectorAll(".dropdown, .nav-item.dropdown")).map(
      (d) => {
        const toggle = d.querySelector(".dropdown-toggle")?.textContent?.trim() || "";
        const items = Array.from(d.querySelectorAll(".dropdown-menu a, .dropdown-item")).map(
          (item) => ({
            text: item.textContent?.trim().replace(/\s+/g, " "),
            href: (item as HTMLAnchorElement).href,
          }),
        );
        return { toggle, items };
      },
    );

    const allLinks = Array.from(document.querySelectorAll("a[href]")).map((a) => ({
      text: a.textContent?.trim().replace(/\s+/g, " "),
      href: (a as HTMLAnchorElement).href,
    }));

    return { dropdowns, allLinks };
  });

  console.log("Nav Tree Dropdowns:", JSON.stringify(navTree.dropdowns, null, 2));
  console.log("All Links Count:", navTree.allLinks.length);

  fs.writeFileSync("docs/legacy-analysis/nav-tree.json", JSON.stringify(navTree, null, 2));

  await browser.close();
}

main().catch(console.error);
