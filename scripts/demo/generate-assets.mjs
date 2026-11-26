// Tạo các file tài liệu mẫu (PDF/PNG) cho tài khoản demo.
// Chạy: node scripts/demo/generate-assets.mjs
// Kết quả: backend/scripts/demo-assets/*.pdf, *.png
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outputDirectory = path.join(rootDirectory, "backend/scripts/demo-assets");

const baseStyle = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; color: #123552; }
  .page { padding: 56px 64px; }
  .tag { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #e6f2ff; color: #2f689f;
         font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  h1 { font-size: 30px; margin: 16px 0 8px; letter-spacing: -0.02em; }
  h2 { font-size: 18px; margin: 28px 0 8px; color: #2f689f; }
  p, li { font-size: 14px; line-height: 1.7; color: #334155; }
  .muted { color: #64748b; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th, td { border: 1px solid #dbeafe; padding: 8px 10px; text-align: left; }
  th { background: #f0f7ff; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12.5px; }
  .box { border: 1px solid #dbeafe; border-left: 4px solid #4f8edc; background: #f8fbff; padding: 12px 16px;
         border-radius: 8px; margin-top: 12px; }
`;

const pdfDocuments = [
  {
    file: "de-cuong-lap-trinh-web.pdf",
    html: `
      <div class="page">
        <span class="tag">WEB301 · Đề cương</span>
        <h1>Đề cương ôn tập Lập trình Web</h1>
        <p class="muted">Tài liệu mẫu dùng cho bản demo Study Manager.</p>
        <h2>1. HTML &amp; CSS</h2>
        <ul>
          <li>Cấu trúc tài liệu HTML5, thẻ ngữ nghĩa (<code>header</code>, <code>main</code>, <code>section</code>).</li>
          <li>Flexbox và Grid: căn chỉnh, chia cột, responsive với media query.</li>
        </ul>
        <h2>2. JavaScript</h2>
        <ul>
          <li>Biến, hàm, mảng, đối tượng; <code>map</code>, <code>filter</code>, <code>reduce</code>.</li>
          <li>Bất đồng bộ: Promise, <code>async/await</code>, gọi API bằng <code>fetch</code>.</li>
        </ul>
        <h2>3. React</h2>
        <ul>
          <li>Component, props, state; hook <code>useState</code>, <code>useEffect</code>.</li>
          <li>React Router: định nghĩa route, route cần đăng nhập.</li>
        </ul>
        <h2>4. Node.js &amp; Express</h2>
        <ul>
          <li>Tạo REST API, middleware xác thực JWT, xử lý lỗi.</li>
          <li>Kết nối MongoDB bằng Mongoose, thiết kế schema.</li>
        </ul>
        <div class="box"><strong>Hình thức thi:</strong> đồ án nhóm + vấn đáp 15 phút.</div>
      </div>`,
  },
  {
    file: "on-tap-sql-join.pdf",
    html: `
      <div class="page">
        <span class="tag">CSDL202 · Ôn tập</span>
        <h1>Tóm tắt các loại JOIN trong SQL</h1>
        <p class="muted">Tài liệu mẫu dùng cho bản demo Study Manager.</p>
        <table>
          <tr><th>Loại JOIN</th><th>Kết quả</th><th>Ví dụ</th></tr>
          <tr><td>INNER JOIN</td><td>Chỉ các dòng khớp ở cả hai bảng</td><td><code>SinhVien ⨝ DangKy</code></td></tr>
          <tr><td>LEFT JOIN</td><td>Mọi dòng bảng trái + dòng khớp bên phải</td><td>Sinh viên chưa đăng ký môn</td></tr>
          <tr><td>RIGHT JOIN</td><td>Mọi dòng bảng phải + dòng khớp bên trái</td><td>Môn học chưa có sinh viên</td></tr>
          <tr><td>FULL OUTER JOIN</td><td>Tất cả dòng của hai bảng</td><td>Đối chiếu dữ liệu</td></tr>
        </table>
        <h2>Câu truy vấn mẫu</h2>
        <div class="box"><code>SELECT sv.HoTen, mh.TenMon FROM SinhVien sv LEFT JOIN DangKy dk ON sv.MaSV = dk.MaSV LEFT JOIN MonHoc mh ON dk.MaMon = mh.MaMon;</code></div>
        <h2>Lưu ý</h2>
        <ul>
          <li>Điều kiện lọc trên bảng phải nên đặt trong <code>ON</code> khi dùng LEFT JOIN.</li>
          <li>Dùng bí danh bảng để câu lệnh ngắn gọn, dễ đọc.</li>
        </ul>
      </div>`,
  },
  {
    file: "bai-tap-cau-truc-du-lieu.pdf",
    html: `
      <div class="page">
        <span class="tag">CTDL203 · Bài tập</span>
        <h1>Bài tập tuần 9 – Cây nhị phân tìm kiếm</h1>
        <p class="muted">Tài liệu mẫu dùng cho bản demo Study Manager.</p>
        <h2>Bài 1</h2>
        <p>Chèn lần lượt các khóa 50, 30, 70, 20, 40, 60, 80 vào cây BST rỗng. Vẽ cây kết quả.</p>
        <h2>Bài 2</h2>
        <p>Viết hàm duyệt cây theo thứ tự giữa (in-order) và cho biết độ phức tạp thời gian.</p>
        <h2>Bài 3</h2>
        <p>Xóa nút 30 khỏi cây ở Bài 1. Trình bày ba trường hợp xóa nút trong BST.</p>
        <div class="box"><strong>Hạn nộp:</strong> theo deadline trên Study Manager.</div>
      </div>`,
  },
];

const diagramHtml = `
  <div style="width:960px;height:600px;padding:40px;background:linear-gradient(135deg,#f0f7ff,#ffffff);">
    <span class="tag">CTDL203 · Sơ đồ</span>
    <h1 style="margin-top:14px">Cây nhị phân tìm kiếm (BST)</h1>
    <svg width="880" height="420" viewBox="0 0 880 420" font-family="Segoe UI, Arial" font-size="20" font-weight="700">
      ${[
        [440, 60, 220, 180], [440, 60, 660, 180],
        [220, 180, 110, 310], [220, 180, 330, 310],
        [660, 180, 550, 310], [660, 180, 770, 310],
      ].map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#93c5fd" stroke-width="4"/>`).join("")}
      ${[
        [440, 60, 50], [220, 180, 30], [660, 180, 70],
        [110, 310, 20], [330, 310, 40], [550, 310, 60], [770, 310, 80],
      ].map(([x, y, value]) => `
        <circle cx="${x}" cy="${y}" r="36" fill="#4f8edc"/>
        <text x="${x}" y="${y + 7}" text-anchor="middle" fill="#fff">${value}</text>`).join("")}
      <text x="440" y="400" text-anchor="middle" fill="#64748b" font-size="16" font-weight="600">Duyệt in-order: 20 · 30 · 40 · 50 · 60 · 70 · 80</text>
    </svg>
  </div>`;

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();

for (const documentItem of pdfDocuments) {
  await page.setContent(`<style>${baseStyle}</style>${documentItem.html}`);
  await page.pdf({ path: path.join(outputDirectory, documentItem.file), format: "A4", printBackground: true });
  console.log("Đã tạo", documentItem.file);
}

await page.setViewportSize({ width: 960, height: 600 });
await page.setContent(`<style>${baseStyle}</style>${diagramHtml}`);
await page.screenshot({ path: path.join(outputDirectory, "so-do-cay-nhi-phan.png") });
console.log("Đã tạo so-do-cay-nhi-phan.png");

await browser.close();
