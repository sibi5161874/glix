import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const page = await browser.newPage();

  page.on("console", (msg) => console.log("PAGE CONSOLE:", msg.text()));
  page.on("response", (res) => console.log("RESPONSE:", res.status(), res.url()));

  console.log("Navigating to login page...");
  await page.goto("https://connect.rmd.city/public/superadmin/login", { waitUntil: "networkidle" });

  const formAction = await page.$eval("form", (f) => ({ action: f.action, method: f.method }));
  console.log("Form details:", formAction);

  console.log("Filling credentials...");
  await page.fill('input[type="email"], input[name="email"]', "superadmin@glix.ae");
  await page.fill('input[type="password"], input[name="password"]', "Connect1@345");

  console.log("Clicking submit...");
  await page.click('button[type="submit"], input[type="submit"]');

  await page.waitForTimeout(4000);

  console.log("Current URL after submit:", page.url());
  await page.screenshot({ path: "docs/legacy-analysis/screenshots/00-login-post-submit.png" });

  const pageText = await page.innerText("body");
  console.log("Page text snippet:", pageText.slice(0, 1000));

  await browser.close();
}

main().catch(console.error);
