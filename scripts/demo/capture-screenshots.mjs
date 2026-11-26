// Chụp bộ ảnh demo Study Manager bằng Playwright.
// Yêu cầu: backend + frontend đang chạy và đã seed dữ liệu (backend/scripts/seed-demo.js).
// Chạy: node scripts/demo/capture-screenshots.mjs
//   FRONTEND_URL (mặc định http://localhost:5173), DEMO_PASSWORD (mặc định như seed-demo.js)
// Kết quả: demo-screenshots/*.webp (chất lượng 85)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outputDirectory = path.join(rootDirectory, "demo-screenshots");
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
const DEMO_EMAIL = "demo@studymanager.local";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "StudyDemo@2026";
const WEBP_QUALITY = 0.85;
const only = process.argv.slice(2);

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  // Chờ skeleton/spinner biến mất
  await page
    .waitForFunction(() => !document.querySelector(".animate-pulse, .animate-spin"), null, { timeout: 15000 })
    .catch(() => console.warn("  (cảnh báo) vẫn còn phần tử loading"));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800); // để animation vào trang chạy xong
}

// Cuộn để phần tử chứa đoạn chữ (không phân biệt hoa thường) nằm ngay dưới header cố định
async function scrollToText(page, text) {
  await page.evaluate((targetText) => {
    const target = [...document.querySelectorAll("main p, main h2, main h3")].find(
      (element) => element.textContent.trim().toLowerCase() === targetText.toLowerCase(),
    );
    if (!target) throw new Error(`Không tìm thấy "${targetText}" để cuộn tới`);
    const section = target.closest("section") || target;
    let container = section.parentElement;
    while (container && container !== document.body) {
      const { overflowY } = getComputedStyle(container);
      if (/(auto|scroll)/.test(overflowY) && container.scrollHeight > container.clientHeight) break;
      container = container.parentElement;
    }
    const offset = 96;
    if (!container || container === document.body) {
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - offset);
    } else {
      container.scrollTop += section.getBoundingClientRect().top - offset;
    }
  }, text);
}

async function toWebp(converterPage, pngBuffer) {
  const dataUrl = await converterPage.evaluate(
    async ({ base64, quality }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      return canvas.toDataURL("image/webp", quality);
    },
    { base64: pngBuffer.toString("base64"), quality: WEBP_QUALITY },
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

async function capture(page, converterPage, fileName) {
  if (only.length && !only.some((name) => fileName.includes(name))) return;
  await settle(page);
  const png = await page.screenshot({ type: "png" });
  await writeFile(path.join(outputDirectory, fileName), await toWebp(converterPage, png));
  console.log("Đã chụp", fileName);
}

async function login(page) {
  await page.goto(`${FRONTEND_URL}/login`);
  await page.fill('input[type="email"]', DEMO_EMAIL);
  await page.fill('input[type="password"]', DEMO_PASSWORD);
  await Promise.all([
    page.waitForURL("**/dashboard", { timeout: 15000 }),
    page.press('input[type="password"]', "Enter"),
  ]);
}

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();
const converterPage = await browser.newPage();

// ---- Desktop 1440x900 ----
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "vi-VN" });
  const page = await context.newPage();

  await page.goto(`${FRONTEND_URL}/`);
  await capture(page, converterPage, "01-landing.webp");

  await login(page);
  await capture(page, converterPage, "02-dashboard.webp");

  // [route, file, tiêu đề cần cuộn tới để nội dung chính nằm trong khung hình]
  const routes = [
    ["/subjects", "03-subjects.webp"],
    ["/tasks", "04-tasks.webp", "Bộ lọc"],
    ["/schedule", "05-schedule.webp", "Lịch theo tuần"],
    ["/documents", "06-documents.webp", "Kho tài liệu"],
  ];
  for (const [route, fileName, scrollTarget] of routes) {
    await page.goto(`${FRONTEND_URL}${route}`);
    if (scrollTarget) {
      await settle(page);
      await scrollToText(page, scrollTarget);
    }
    await capture(page, converterPage, fileName);
  }

  // Xem tài liệu dạng ảnh (PDF trong iframe không hiển thị ở Chromium headless)
  // Link "Mở file" mở tab mới nên lấy href rồi điều hướng trực tiếp
  const imageCard = page.locator("article, div").filter({ hasText: "Sơ đồ cây nhị phân tìm kiếm" }).filter({ has: page.getByText("Mở file") }).last();
  const viewerPath = await imageCard.getByRole("link", { name: "Mở file" }).getAttribute("href");
  await page.goto(`${FRONTEND_URL}${viewerPath}`);
  await page.locator("img[alt='Sơ đồ cây nhị phân tìm kiếm']").waitFor();
  await capture(page, converterPage, "07-document-viewer.webp");

  await page.goto(`${FRONTEND_URL}/statistics`);
  await capture(page, converterPage, "08-statistics.webp");

  await context.close();
}

// ---- Mobile 390x844 ----
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: "vi-VN",
  });
  const page = await context.newPage();

  await page.goto(`${FRONTEND_URL}/`);
  await capture(page, converterPage, "mobile-01-landing.webp");

  await login(page);
  await capture(page, converterPage, "mobile-02-dashboard.webp");

  await context.close();
}

await browser.close();
