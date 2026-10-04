import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const page = await browser.newPage();

  console.log("Navigating to https://connect.rmd.city/public/login...");
  await page.goto("https://connect.rmd.city/public/login", { waitUntil: "networkidle" });
  console.log("Final URL:", page.url());
  console.log("Title:", await page.title());

  const inputs = await page.$$eval("input", (els) =>
    els.map((el) => ({ name: el.name, type: el.type, id: el.id, placeholder: el.placeholder })),
  );
  console.log("Inputs on /public/login:", JSON.stringify(inputs, null, 2));

  const text = await page.innerText("body");
  console.log("Body text:", text.slice(0, 800));

  await browser.close();
}

main().catch(console.error);
