import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  await page.goto("https://connect.rmd.city/public/register", { waitUntil: "networkidle" });

  const scripts = await page.$$eval("script", (scrs) => scrs.map((s) => s.textContent || s.src));
  console.log(
    "Inline scripts:",
    scripts.filter((s) => s && s.length < 5000 && !s.startsWith("http")),
  );

  // Let's also see all inputs in the form
  const inputs = await page.$$eval("form input, form select", (els) =>
    els.map((e) => ({
      name: e.name,
      type: e.getAttribute("type") || e.tagName,
      id: e.id,
      required: e.hasAttribute("required"),
      value: (e as any).value,
    })),
  );
  console.log("Form inputs:", inputs);

  await browser.close();
}

main().catch(console.error);
