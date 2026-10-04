import { chromium, type Page } from "playwright";
import * as fs from "fs";

const BASE_URL = "https://connect.rmd.city/public";
const LOGIN_URL = `${BASE_URL}/superadmin/login`;
const SCREENSHOTS_DIR = "docs/legacy-analysis/screenshots";

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

interface ScreenInfo {
  url: string;
  title: string;
  screenshot: string;
  inputs: Array<{ name: string; type: string; id: string; placeholder: string; required: boolean }>;
  selects: Array<{ name: string; id: string; options: string[] }>;
  buttons: Array<{ text: string; type: string; id: string; className: string }>;
  tables: Array<{ headers: string[]; rowCount: number; sampleRow?: string[] }>;
  links: Array<{ text: string; href: string }>;
  navItems: Array<{ text: string; href: string; icon?: string }>;
  errors: string[];
}

const discoveredScreens: Map<string, ScreenInfo> = new Map();
const queue: string[] = [];
const visitedUrls = new Set<string>();

async function extractScreenData(page: Page, screenshotName: string): Promise<ScreenInfo> {
  const url = page.url();
  const title = await page.title();
  const screenshotPath = `${SCREENSHOTS_DIR}/${screenshotName}`;

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
      text: el.textContent?.trim() || "",
      type: el.getAttribute("type") || "button",
      id: el.id,
      className: el.className,
    })),
  );

  const tables = await page.$$eval("table", (els) =>
    els.map((tbl) => {
      const headers = Array.from(tbl.querySelectorAll("th")).map(
        (th) => th.textContent?.trim() || "",
      );
      const rows = Array.from(tbl.querySelectorAll("tbody tr"));
      let sampleRow: string[] = [];
      if (rows.length > 0 && rows[0]) {
        sampleRow = Array.from(rows[0].querySelectorAll("td")).map(
          (td) => td.textContent?.trim() || "",
        );
      }
      return {
        headers,
        rowCount: rows.length,
        sampleRow,
      };
    }),
  );

  const links = await page.$$eval("a[href]", (els) =>
    els.map((el) => ({
      text: el.textContent?.trim() || "",
      href: (el as HTMLAnchorElement).href,
    })),
  );

  const navItems = await page.$$eval(".nav-item a, .sidebar a, .navbar a, aside a", (els) =>
    els.map((el) => ({
      text: el.textContent?.trim() || "",
      href: (el as HTMLAnchorElement).href,
    })),
  );

  return {
    url,
    title,
    screenshot: screenshotPath,
    inputs,
    selects,
    buttons,
    tables,
    links,
    navItems,
    errors: [],
  };
}

async function main() {
  console.log("Starting automated crawl of legacy app...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // 1. Login
  console.log("Navigating to Super Admin Login...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', "superadmin@glix.ae");
  await page.fill('input[name="password"]', "Connect1@345");

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle", timeout: 15000 }).catch(() => {}),
    page.click('button[type="submit"], input[type="submit"], .btn-primary'),
  ]);

  const landingUrl = page.url();
  console.log("Post-login Landing URL:", landingUrl);

  const landingScreen = await extractScreenData(page, "01-landing.png");
  discoveredScreens.set(landingUrl, landingScreen);
  visitedUrls.add(landingUrl);

  // Extract all navigation targets from landing
  for (const item of landingScreen.links) {
    if (
      item.href.startsWith(BASE_URL) &&
      !item.href.includes("logout") &&
      !visitedUrls.has(item.href)
    ) {
      if (!queue.includes(item.href)) {
        queue.push(item.href);
      }
    }
  }

  console.log(`Discovered ${queue.length} initial internal links.`);

  let screenIndex = 2;
  while (queue.length > 0 && screenIndex < 35) {
    const nextUrl = queue.shift()!;
    if (visitedUrls.has(nextUrl)) continue;

    console.log(`[${screenIndex}] Crawling: ${nextUrl}`);
    visitedUrls.add(nextUrl);

    try {
      await page.goto(nextUrl, { waitUntil: "networkidle", timeout: 20000 });
      const currentUrl = page.url();
      const padIndex = String(screenIndex).padStart(2, "0");
      const urlSlug = currentUrl
        .replace(BASE_URL, "")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .slice(0, 30);
      const screenshotName = `${padIndex}-${urlSlug}.png`;

      const screenData = await extractScreenData(page, screenshotName);
      discoveredScreens.set(currentUrl, screenData);

      // Collect new links
      for (const item of screenData.links) {
        if (
          item.href.startsWith(BASE_URL) &&
          !item.href.includes("logout") &&
          !item.href.includes("delete") &&
          !visitedUrls.has(item.href) &&
          !queue.includes(item.href)
        ) {
          queue.push(item.href);
        }
      }
      screenIndex++;
    } catch (err) {
      console.warn(`Error crawling ${nextUrl}:`, err);
    }
  }

  console.log(`Crawl completed. Visited ${discoveredScreens.size} unique screens.`);

  // Write outputs
  fs.writeFileSync(
    "docs/legacy-analysis/crawl-results.json",
    JSON.stringify(Array.from(discoveredScreens.entries()), null, 2),
  );

  await browser.close();
}

main().catch((err) => {
  console.error("Crawl error:", err);
  process.exit(1);
});
