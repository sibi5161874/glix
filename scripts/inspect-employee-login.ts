import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  console.log("Inspecting tenant login page...");
  await page.goto("https://connect.rmd.city/public/login", { waitUntil: "networkidle" });

  const formHtml = await page.evaluate(() => {
    return {
      title: document.title,
      inputs: Array.from(document.querySelectorAll("input, select, button, a")).map((el) => ({
        tag: el.tagName,
        type: (el as HTMLInputElement).type || "",
        name: (el as HTMLInputElement).name || (el as HTMLInputElement).id || "",
        text: el.textContent?.trim() || "",
        placeholder: (el as HTMLInputElement).placeholder || "",
      })),
      body: document.body.innerHTML,
    };
  });

  console.log("Page title:", formHtml.title);
  console.log("Inputs & elements found on /login:", formHtml.inputs);

  await browser.close();
}

main().catch(console.error);
