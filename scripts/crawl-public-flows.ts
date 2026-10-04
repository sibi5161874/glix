import { chromium } from "playwright";
import * as fs from "fs";

const pagesToCrawl = [
  { name: "01-landing", url: "https://connect.rmd.city/public/" },
  { name: "02-login", url: "https://connect.rmd.city/public/login" },
  { name: "03-superadmin-login", url: "https://connect.rmd.city/public/superadmin/login" },
  { name: "04-register-org", url: "https://connect.rmd.city/public/register" },
  { name: "05-tenant-setup", url: "https://connect.rmd.city/public/tenant/setup?plan=free" },
  { name: "06-privacy-policy", url: "https://connect.rmd.city/public/privacy-policy" },
  { name: "07-terms-conditions", url: "https://connect.rmd.city/public/terms-conditions" },
  { name: "08-refund-policy", url: "https://connect.rmd.city/public/refund-policy" },
];

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results: any[] = [];

  for (const item of pagesToCrawl) {
    console.log(`Navigating to ${item.name}: ${item.url}`);
    try {
      const resp = await page.goto(item.url, { waitUntil: "networkidle", timeout: 20000 });
      const title = await page.title();
      const screenshotPath = `docs/legacy-analysis/screenshots/${item.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const inputs = await page.$$eval("input", (els) =>
        els.map((el) => ({
          name: el.name,
          type: el.type,
          id: el.id,
          placeholder: el.placeholder,
          required: el.required,
        })),
      );

      const selects = await page.$$eval("select", (els) =>
        els.map((el) => ({
          name: el.name,
          id: el.id,
          options: Array.from(el.options).map((o) => o.text.trim()),
        })),
      );

      const buttons = await page.$$eval("button, input[type=submit], .btn", (els) =>
        els.map((el) => ({
          text: el.textContent?.trim(),
          type: el.getAttribute("type") || "button",
          className: el.className,
        })),
      );

      const links = await page.$$eval("a[href]", (els) =>
        els.map((el) => ({
          text: el.textContent?.trim(),
          href: (el as HTMLAnchorElement).href,
        })),
      );

      const text = await page.innerText("body");

      results.push({
        name: item.name,
        url: item.url,
        finalUrl: page.url(),
        status: resp?.status(),
        title,
        screenshot: screenshotPath,
        inputs,
        selects,
        buttons,
        links,
        bodySnippet: text.slice(0, 1500),
      });
    } catch (e: any) {
      console.error(`Error on ${item.name}:`, e.message);
    }
  }

  fs.writeFileSync(
    "docs/legacy-analysis/public-pages-analysis.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    "Public pages crawl finished and saved to docs/legacy-analysis/public-pages-analysis.json",
  );

  await browser.close();
}

main().catch(console.error);
