import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const page = await browser.newPage();

  console.log("Testing login at https://connect.rmd.city/public/login ...");
  await page.goto("https://connect.rmd.city/public/login", { waitUntil: "networkidle" });
  await page.fill('input[name="login"]', "superadmin@glix.ae");
  await page.fill('input[name="password"]', "Connect1@345");
  await page.click('button[type="submit"]');

  await page.waitForTimeout(4000);
  console.log("Current URL after submit:", page.url());
  const text = await page.innerText("body");
  console.log("Page text snippet:", text.slice(0, 1000));

  await browser.close();
}

main().catch(console.error);
