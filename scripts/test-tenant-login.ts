import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const page = await browser.newPage();

  console.log("Testing https://connect.rmd.city/public/login ...");
  await page.goto("https://connect.rmd.city/public/login", { waitUntil: "networkidle" });
  await page.screenshot({ path: "docs/legacy-analysis/screenshots/00-tenant-login.png" });

  await page.fill('input[type="email"], input[name="email"]', "superadmin@glix.ae");
  await page.fill('input[type="password"], input[name="password"]', "Connect1@345");
  await page.click('button[type="submit"], input[type="submit"]');

  await page.waitForTimeout(4000);
  console.log("Current URL after submit on /login:", page.url());
  const bodyText = await page.innerText("body");
  console.log("Page text:", bodyText.slice(0, 500));

  await browser.close();
}

main().catch(console.error);
