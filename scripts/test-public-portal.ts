import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const page = await browser.newPage();

  console.log("Navigating to public URL: https://connect.rmd.city/public/ ...");
  const response = await page.goto("https://connect.rmd.city/public/", {
    waitUntil: "networkidle",
  });
  console.log("Status:", response?.status());
  console.log("Final URL:", page.url());
  console.log("Title:", await page.title());

  await page.screenshot({
    path: "docs/legacy-analysis/screenshots/00-public-home.png",
    fullPage: true,
  });

  const bodyText = await page.innerText("body");
  console.log("Body snippet:", bodyText.slice(0, 1000));

  const links = await page.$$eval("a[href]", (els) =>
    els.map((el) => ({
      text: el.textContent?.trim(),
      href: (el as HTMLAnchorElement).href,
    })),
  );
  console.log("Discovered links on public page:", JSON.stringify(links, null, 2));

  await browser.close();
}

main().catch(console.error);
