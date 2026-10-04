import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  await page.goto("https://connect.rmd.city/public/register", { waitUntil: "networkidle" });

  console.log(
    "Forms on page:",
    await page.$$eval("form", (forms) =>
      forms.map((f) => ({ action: f.action, method: f.method, id: f.id })),
    ),
  );
  console.log(
    "Buttons:",
    await page.$$eval("button", (btns) =>
      btns.map((b) => ({
        text: b.textContent?.trim(),
        onclick: b.getAttribute("onclick"),
        type: b.type,
        id: b.id,
        class: b.className,
      })),
    ),
  );
  console.log(
    "Steps containers:",
    await page.$$eval("[id*='step'], [class*='step']", (els) =>
      els.map((e) => ({ id: e.id, class: e.className, tag: e.tagName })),
    ),
  );

  await browser.close();
}

main().catch(console.error);
