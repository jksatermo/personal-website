import assert from "node:assert/strict";
import { mkdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const artifacts =
  process.env.BROWSER_ARTIFACTS || "/tmp/personal-website-browser";
const content = JSON.parse(
  await readFile(new URL("../content/portfolio.json", import.meta.url), "utf8"),
);
let executablePath = process.env.CHROMIUM_PATH;
if (!executablePath) {
  try {
    await access("/usr/bin/chromium");
    executablePath = "/usr/bin/chromium";
  } catch {
    /* Use Playwright's installed browser elsewhere. */
  }
}
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox"],
});
const errors = [];
const pendingPhotos = [];
let checks = 0;
function check(condition, message) {
  assert.ok(condition, message);
  checks += 1;
}

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  const apiResponse = page.waitForResponse(
    (response) => response.url().endsWith("/api/portfolio") && response.ok(),
    { timeout: 15000 },
  );
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await apiResponse;
  await page.evaluate(() => document.fonts.ready);
  check(
    (await page.title()).includes(content.profile.name),
    "Document title uses the editable name",
  );
  check(
    (await page.locator("h1").innerText()).includes(content.profile.name),
    "Profile name is visible",
  );
  check(
    (await page.locator(".project-card").count()) === content.projects.length,
    "Every project renders",
  );
  check(
    (await page.getByText("Coming soon", { exact: true }).count()) ===
      content.projects.filter((project) => project.status === "Coming soon")
        .length,
    "Upcoming projects are identified",
  );
  for (const social of content.socials.filter((social) => social.url)) {
    check(
      (await page
        .getByRole("link", {
          name: `${social.name} (opens in a new tab)`,
          exact: true,
        })
        .getAttribute("href")) === social.url,
      `${social.name} uses the correct profile URL`,
    );
  }
  if (content.profile.email) {
    check(
      (await page
        .getByRole("link", { name: content.profile.email, exact: true })
        .getAttribute("href")) === `mailto:${content.profile.email}`,
      "Professional email opens the user's mail application",
    );
  }
  const communityProject = content.projects.find(
    (project) => project.kind === "community",
  );
  if (communityProject) {
    check(
      (await page.locator(".community-brand").innerText()).includes(
        communityProject.title,
      ),
      "Project artwork uses the current church app name",
    );
  }
  for (const photo of [
    content.profile.portrait,
    ...(content.aboutPhotos || []),
  ].filter(Boolean)) {
    if (photo.src.startsWith("/")) {
      try {
        await access(new URL(`../client/public${photo.src}`, import.meta.url));
      } catch {
        pendingPhotos.push(photo.src);
        continue;
      }
    }
    const response = await page.request.get(new URL(photo.src, baseURL).href);
    check(
      response.ok() && response.headers()["content-type"]?.startsWith("image/"),
      `Photo asset is served: ${photo.src}`,
    );
    const photoElement = page.getByRole("img", {
      name: photo.alt,
      exact: true,
    });
    await photoElement.scrollIntoViewIfNeeded();
    await photoElement.evaluate((element) => element.decode());
    check(
      await photoElement.evaluate((element) => element.naturalWidth > 0),
      `Photo renders: ${photo.src}`,
    );
    check(
      (await photoElement.locator("..").getAttribute("href")) === photo.src,
      "Full photo can be opened without the display crop",
    );
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.mouse.move(1000, 180);
  await page.waitForFunction(
    () =>
      document
        .querySelector(".spotlight")
        .style.getPropertyValue("--mouse-x") === "1000px",
  );
  check(
    await page
      .locator(".spotlight")
      .evaluate(
        (element) => getComputedStyle(element).pointerEvents === "none",
      ),
    "Spotlight follows cursor without blocking interaction",
  );
  await page.screenshot({
    path: path.join(artifacts, "desktop.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "02 Experience", exact: false }).click();
  await page.waitForFunction(() =>
    document.querySelector('a[href="#experience"][aria-current="location"]'),
  );
  check(
    await page.locator("#experience").isVisible(),
    "Experience navigation works",
  );
  await page.getByRole("link", { name: "03 Projects", exact: false }).click();
  await page.waitForFunction(() =>
    document.querySelector('a[href="#projects"][aria-current="location"]'),
  );
  check(
    await page.locator("#projects").isVisible(),
    "Projects navigation works",
  );
  await page.getByRole("link", { name: "Back to top", exact: true }).click();
  await page.waitForFunction(() =>
    document.querySelector('a[href="#about"][aria-current="location"]'),
  );
  check(
    await page
      .locator(".profile-panel")
      .evaluate((element) => getComputedStyle(element).position === "sticky"),
    "Desktop introduction stays visible",
  );

  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `No horizontal overflow at ${width}px`,
    );
    if (width === 390) {
      check(
        await page
          .locator(".spotlight")
          .evaluate((element) => getComputedStyle(element).display === "none"),
        "Mobile avoids the desktop spotlight",
      );
      // Lazy group photos load when scrolled into view, including on phones.
      for (const photo of await page.locator("#about img").all()) {
        await photo.scrollIntoViewIfNeeded();
        await photo.evaluate((element) => element.decode());
        check(
          await photo.evaluate((element) => element.naturalWidth > 0 && element.getBoundingClientRect().right <= window.innerWidth),
          "Photo loads and fits the mobile viewport",
        );
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({
        path: path.join(artifacts, "mobile.png"),
        fullPage: true,
      });
    }
  }

  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await reduced.goto(baseURL, { waitUntil: "networkidle" });
  check(
    await reduced
      .locator(".spotlight")
      .evaluate((element) => getComputedStyle(element).display === "none"),
    "Reduced-motion preference disables spotlight",
  );
  await reduced.keyboard.press("Tab");
  check(
    await reduced
      .getByRole("link", { name: "Skip to content" })
      .evaluate((element) => document.activeElement === element),
    "Keyboard users can skip to the content",
  );
  check(
    errors.length === 0,
    `No uncaught browser errors: ${errors.join("; ")}`,
  );
  console.log(`Passed ${checks} browser checks. Screenshots: ${artifacts}`);
  if (pendingPhotos.length) {
    console.log(
      `Photo rendering is not yet verified; files pending upload: ${pendingPhotos.join(", ")}`,
    );
  }
} finally {
  await browser.close();
}
