import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to https://connect.rmd.city/public/register...");
  await page.goto("https://connect.rmd.city/public/register", { waitUntil: "networkidle" });

  const timestamp = Date.now().toString().slice(-6);
  const adminEmail = `admin_${timestamp}@glix-demo.ae`;
  const adminPass = "Test@123456";
  const orgName = `Glix Demo ${timestamp}`;
  const orgSlug = `glix-demo-${timestamp}`;

  console.log(`Trying registration with email: ${adminEmail}, slug: ${orgSlug}`);

  // Step 1: Admin details
  await page.fill('input[name="name"]', "Demo Admin");
  await page.fill('input[name="email"]', adminEmail);
  await page.fill('input[name="password"]', adminPass);
  await page.fill('input[name="password_confirmation"]', adminPass);
  await page.screenshot({ path: "docs/legacy-analysis/screenshots/register-step1.png" });

  // Click continue button for Step 1
  const step1Btn = page.locator('button:has-text("Continue")').first();
  await step1Btn.click();
  await page.waitForTimeout(1000);

  // Step 2: Org details
  console.log("Filling step 2...");
  await page.screenshot({ path: "docs/legacy-analysis/screenshots/register-step2.png" });
  await page.fill('input[name="org_name"]', orgName);
  await page.fill('input[name="org_slug"]', orgSlug);
  await page.fill('input[name="org_phone"]', "+971 50 123 4567");
  await page.selectOption('select[name="org_currency"]', { value: "AED" }).catch(() => {
    return page.selectOption('select[name="org_currency"]', { index: 0 });
  });
  await page.fill('input[name="org_industry"]', "Technology");

  // Click continue to Step 3
  const step2Btn = page.locator('button:has-text("Continue"):visible').first();
  await step2Btn.click();
  await page.waitForTimeout(1000);

  // Step 3: Plan selection
  console.log("Filling step 3 (Plan)...");
  await page.screenshot({ path: "docs/legacy-analysis/screenshots/register-step3.png" });

  // Select free plan radio or card if any
  const planRadios = await page.$$('input[type="radio"], input[name="plan_id"]');
  if (planRadios.length > 0) {
    await planRadios[0].click().catch(() => {});
  }
  const planCards = await page.$$(".card, [data-plan]");
  if (planCards.length > 0) {
    await planCards[0].click().catch(() => {});
  }

  const step3Btn = page.locator('button:has-text("Continue"):visible').first();
  if ((await step3Btn.count()) > 0) {
    await step3Btn.click();
    await page.waitForTimeout(1000);
  }

  // Step 4: Finalize
  console.log("Finalizing registration...");
  await page.screenshot({ path: "docs/legacy-analysis/screenshots/register-step4.png" });
  const submitBtn = page
    .locator('button:has-text("Complete Signup"), button[type="submit"]:visible')
    .first();
  if ((await submitBtn.count()) > 0) {
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }).catch(() => {}),
      submitBtn.click(),
    ]);
  }

  console.log("Current URL after submit:", page.url());
  await page.screenshot({
    path: "docs/legacy-analysis/screenshots/after-register.png",
    fullPage: true,
  });

  const bodyText = await page.innerText("body");
  console.log("Body snippet after register:", bodyText.slice(0, 500));

  await browser.close();
}

main().catch(console.error);
