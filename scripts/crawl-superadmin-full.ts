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
  inputs: Array<{ name: string; type: string; label: string; placeholder: string }>;
  selects: Array<{ name: string; label: string; options: string[] }>;
  buttons: Array<{ text: string; type: string; action: string }>;
  links: Array<{ text: string; href: string }>;
  tables: Array<{ headers: string[]; rowCount: number; sampleRow: string[] }>;
  modals: Array<{ id: string; title: string; fields: string[] }>;
  tabs: string[];
  bodySnippet: string;
}

async function extractSuperadminScreen(
  page: Page,
  id: string,
  name: string,
  module: string,
): Promise<ScreenData> {
  const title = await page.title();
  const currentUrl = page.url();
  const screenshotPath = `docs/legacy-analysis/screenshots/${id}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

  const details = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll("input, textarea")).map((el) => {
      const input = el as HTMLInputElement;
      const labelEl =
        document.querySelector(`label[for="${input.id}"]`) ||
        input.closest("label") ||
        input.parentElement?.querySelector("label");
      return {
        name: input.name || input.id || "",
        type: input.type || "text",
        label: labelEl?.textContent?.trim() || "",
        placeholder: input.placeholder || "",
      };
    });

    const selects = Array.from(document.querySelectorAll("select")).map((el) => {
      const select = el as HTMLSelectElement;
      const labelEl =
        document.querySelector(`label[for="${select.id}"]`) ||
        select.closest("label") ||
        select.parentElement?.querySelector("label");
      return {
        name: select.name || select.id || "",
        label: labelEl?.textContent?.trim() || "",
        options: Array.from(select.options).map((o) => o.text.trim()),
      };
    });

    const buttons = Array.from(document.querySelectorAll("button, input[type='submit'], .btn"))
      .map((el) => ({
        text: el.textContent?.trim().replace(/\s+/g, " ") || "",
        type: (el as HTMLButtonElement).type || "button",
        action:
          el.getAttribute("onclick") ||
          el.getAttribute("@click") ||
          el.getAttribute("x-on:click") ||
          "",
      }))
      .filter((b) => b.text.length > 0 && b.text.length < 50);

    const links = Array.from(document.querySelectorAll("a[href]"))
      .map((el) => ({
        text: el.textContent?.trim().replace(/\s+/g, " ") || "",
        href: (el as HTMLAnchorElement).href,
      }))
      .filter((l) => l.href.startsWith("http") && !l.href.includes("javascript:"));

    const tables = Array.from(document.querySelectorAll("table")).map((tbl) => {
      const headers = Array.from(tbl.querySelectorAll("th")).map(
        (th) => th.textContent?.trim().replace(/\s+/g, " ") || "",
      );
      const rows = Array.from(tbl.querySelectorAll("tbody tr"));
      const firstRowCells = rows[0]
        ? Array.from(rows[0].querySelectorAll("td")).map(
            (td) => td.textContent?.trim().replace(/\s+/g, " ") || "",
          )
        : [];
      return {
        headers,
        rowCount: rows.length,
        sampleRow: firstRowCells,
      };
    });

    const modals = Array.from(
      document.querySelectorAll(".modal, [x-show*='modal'], [x-show*='show']"),
    ).map((m, idx) => {
      const titleEl = m.querySelector(".modal-title, h1, h2, h3, h4, h5");
      const modalInputs = Array.from(m.querySelectorAll("input, select, textarea")).map(
        (i) => (i as HTMLInputElement).name || (i as HTMLInputElement).placeholder || i.tagName,
      );
      return {
        id: m.id || `modal-${idx}`,
        title: titleEl?.textContent?.trim() || "Modal Window",
        fields: modalInputs,
      };
    });

    const tabs = Array.from(
      document.querySelectorAll(".nav-tabs .nav-link, .tabs button, [role='tab']"),
    )
      .map((t) => t.textContent?.trim() || "")
      .filter(Boolean);

    const mainContent =
      document.querySelector("main, #main, .content, .container, body")?.textContent || "";
    const bodySnippet = mainContent.replace(/\s+/g, " ").slice(0, 500);

    return { inputs, selects, buttons, links, tables, modals, tabs, bodySnippet };
  });

  return {
    id,
    name,
    url: page.url(),
    finalUrl: currentUrl,
    module,
    title,
    screenshot: screenshotPath,
    ...details,
  };
}

async function main() {
  console.log("🚀 Launching full Superadmin & 100% crawl session...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Superadmin Login
  console.log("🔑 Logging into Superadmin portal...");
  await page.goto("https://connect.rmd.city/public/superadmin/login", {
    waitUntil: "networkidle",
  });
  await page.fill('input[name="email"]', "superadmin@glix.ae");
  await page.fill('input[name="password"]', "Connect1@");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  const superadminScreens: ScreenData[] = [];

  // Capture Dashboard
  console.log("📸 Capturing Superadmin Dashboard...");
  const dashScreen = await extractSuperadminScreen(
    page,
    "superadmin-01-dashboard",
    "Super Admin Dashboard",
    "SuperAdmin Platform Control",
  );
  superadminScreens.push(dashScreen);

  // Discover all superadmin links from sidebar & header
  const discoveredLinks = await page.evaluate(() => {
    const navLinks = Array.from(document.querySelectorAll("a[href]"))
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((h) => h.includes("/superadmin/") && !h.includes("logout") && !h.includes("#"));
    return Array.from(new Set(navLinks));
  });

  console.log(`Discovered ${discoveredLinks.length} Superadmin URLs:`, discoveredLinks);

  // Visit every discovered superadmin route
  let screenIndex = 2;
  for (const url of discoveredLinks) {
    if (url === page.url()) continue;
    try {
      console.log(`Visiting Superadmin Route: ${url}`);
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1500);

      const pathName = new URL(url).pathname.split("/").pop() || `page-${screenIndex}`;
      const screenId = `superadmin-${String(screenIndex).padStart(2, "0")}-${pathName}`;
      const _title = await page.title();

      const screen = await extractSuperadminScreen(
        page,
        screenId,
        `Super Admin ${pathName}`,
        "SuperAdmin Platform Control",
      );
      superadminScreens.push(screen);
      screenIndex++;

      // If page has tabs, click and capture tabs
      const tabElements = await page.$$(".nav-tabs .nav-link, [role='tab']");
      for (let t = 0; t < tabElements.length; t++) {
        try {
          const tabText = await tabElements[t].textContent();
          await tabElements[t].click();
          await page.waitForTimeout(1000);
          const tabScreenId = `${screenId}-tab-${t + 1}`;
          const tabScreen = await extractSuperadminScreen(
            page,
            tabScreenId,
            `Super Admin ${pathName} - ${tabText?.trim()}`,
            "SuperAdmin Platform Control",
          );
          superadminScreens.push(tabScreen);
        } catch {
          // continue
        }
      }
    } catch (err) {
      console.error(`Error crawling ${url}:`, err);
    }
  }

  // Save Superadmin crawl output
  fs.writeFileSync(
    "docs/legacy-analysis/superadmin-crawl.json",
    JSON.stringify(superadminScreens, null, 2),
    "utf-8",
  );
  console.log(`✅ Saved ${superadminScreens.length} Superadmin screens!`);

  await browser.close();
}

main().catch(console.error);
