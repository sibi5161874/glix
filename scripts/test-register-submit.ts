import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to https://connect.rmd.city/public/register...");
  await page.goto("https://connect.rmd.city/public/register", { waitUntil: "networkidle" });

  const timestamp = Date.now().toString().slice(-5);
  const testEmail = `org_admin_${timestamp}@glix-corp.ae`;
  const testPass = "Secret123!@#";
  const testOrg = `Apex Tech ${timestamp}`;
  const testSlug = `apex-tech-${timestamp}`;

  console.log(`Setting registration data: email=${testEmail}, slug=${testSlug}`);

  // Evaluate directly in Alpine component
  await page.evaluate(
    ({ email, pass, org, slug }) => {
      const wizardEl = document.querySelector("[x-data]") as any;
      if (wizardEl && wizardEl._x_dataStack) {
        const data = wizardEl._x_dataStack[0];
        data.formData.name = "Apex Admin";
        data.formData.email = email;
        data.formData.password = pass;
        data.formData.password_confirmation = pass;
        data.formData.org_name = org;
        data.formData.org_slug = slug;
        data.formData.org_currency = "AED";
        data.formData.org_phone = "+971 50 888 9999";
        data.formData.plan_id = "1";
        data.currentStep = 4;
      }
      // Also fill the actual form inputs
      (document.querySelector('input[name="name"]') as HTMLInputElement).value = "Apex Admin";
      (document.querySelector('input[name="email"]') as HTMLInputElement).value = email;
      (document.querySelector('input[name="password"]') as HTMLInputElement).value = pass;
      (document.querySelector('input[name="password_confirmation"]') as HTMLInputElement).value =
        pass;
      (document.querySelector('input[name="org_name"]') as HTMLInputElement).value = org;
      (document.querySelector('input[name="org_slug"]') as HTMLInputElement).value = slug;
      (document.querySelector('input[name="org_phone"]') as HTMLInputElement).value =
        "+971 50 888 9999";
      (document.querySelector('input[name="plan_id"]') as HTMLInputElement).value = "1";
    },
    { email: testEmail, pass: testPass, org: testOrg, slug: testSlug },
  );

  await page.screenshot({ path: "docs/legacy-analysis/screenshots/register-step4-filled.png" });

  // Now submit form
  console.log("Submitting form...");
  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  console.log("Post registration URL:", page.url());
  await page.screenshot({
    path: "docs/legacy-analysis/screenshots/post-register.png",
    fullPage: true,
  });

  const postText = await page.innerText("body");
  console.log("Post registration body:\n", postText.slice(0, 1000));

  // Check if we are logged in or on dashboard or login screen
  const cookies = await context.cookies();
  console.log(
    "Cookies:",
    cookies.map((c) => ({ name: c.name, domain: c.domain, path: c.path })),
  );

  await browser.close();
}

main().catch(console.error);
