import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  console.log("Navigating to superadmin login...");
  await page.goto("https://connect.rmd.city/public/superadmin/login", {
    waitUntil: "networkidle",
  });
  await page.fill('input[name="email"]', "superadmin@glix.ae");
  await page.fill('input[name="password"]', "Connect1@");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  const url = page.url();
  console.log(`Landed on URL: ${url}`);
  const title = await page.title();
  console.log(`Page Title: ${title}`);

  if (!url.includes("/login")) {
    console.log("🎉 Superadmin login SUCCESSFUL!");
    await page.screenshot({
      path: "docs/legacy-analysis/screenshots/superadmin-dashboard.png",
      fullPage: true,
    });
  } else {
    console.log("Login failed or stayed on login page.");
  }

  await browser.close();
}

main().catch(console.error);
