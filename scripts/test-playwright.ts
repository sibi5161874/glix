import { chromium } from "playwright";

async function main() {
  console.log("Launching Edge browser...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to https://connect.rmd.city/public/superadmin/login...");
  const response = await page.goto("https://connect.rmd.city/public/superadmin/login", {
    waitUntil: "networkidle",
    timeout: 30000,
  });

  console.log("Response status:", response?.status());
  const title = await page.title();
  console.log("Page title:", title);

  // Take screenshot
  await page.screenshot({ path: "docs/legacy-analysis/screenshots/00-login.png" });
  console.log("Screenshot saved to docs/legacy-analysis/screenshots/00-login.png");

  // Inspect form fields
  const inputs = await page.$$eval("input", (elements) =>
    elements.map((el) => ({
      name: el.name,
      type: el.type,
      id: el.id,
      placeholder: el.placeholder,
      required: el.required,
      value: el.value,
    })),
  );
  console.log("Input fields:", JSON.stringify(inputs, null, 2));

  // Inspect buttons
  const buttons = await page.$$eval("button, input[type=submit]", (elements) =>
    elements.map((el) => ({
      text: el.textContent?.trim(),
      type: el.getAttribute("type"),
      id: el.id,
      className: el.className,
    })),
  );
  console.log("Buttons:", JSON.stringify(buttons, null, 2));

  // Inspect links
  const links = await page.$$eval("a", (elements) =>
    elements.map((el) => ({
      text: el.textContent?.trim(),
      href: el.href,
    })),
  );
  console.log("Links:", JSON.stringify(links, null, 2));

  await browser.close();
}

main().catch((err) => {
  console.error("Playwright error:", err);
  process.exit(1);
});
