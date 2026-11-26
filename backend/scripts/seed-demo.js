/*
 * Tạo dữ liệu demo cho Study Manager thông qua REST API (backend phải đang chạy).
 *
 *   node scripts/seed-demo.js            (chạy trong thư mục backend)
 *   API_URL=http://localhost:5050/api node scripts/seed-demo.js
 *
 * Tài khoản demo (chỉ dùng cho môi trường local, KHÔNG phải thông tin thật):
 *   Tên:      Sinh viên Demo
 *   Email:    demo@studymanager.local
 *   Mật khẩu: StudyDemo@2026   (có thể đổi bằng biến DEMO_PASSWORD)
 *
 * Script chạy lại được: mỗi lần chạy sẽ xóa toàn bộ môn học, deadline, lịch học
 * và tài liệu của RIÊNG tài khoản demo rồi tạo lại. Dữ liệu của tài khoản khác
 * không bị đụng tới. Deadline được tính tương đối theo ngày chạy script.
 */
const fs = require("fs");
const path = require("path");

const API_URL = (process.env.API_URL || "http://localhost:5050/api").replace(/\/$/, "");
const DEMO_USER = {
  name: "Sinh viên Demo",
  email: "demo@studymanager.local",
  password: process.env.DEMO_PASSWORD || "StudyDemo@2026",
};
const ASSETS_DIRECTORY = path.join(__dirname, "demo-assets");

const SUBJECTS = [
  { key: "web", code: "WEB301", name: "Lập trình Web", credits: 3, teacher: "ThS. Lê Minh Khoa", description: "Xây dựng ứng dụng web với React, Node.js và MongoDB." },
  { key: "db", code: "CSDL202", name: "Cơ sở dữ liệu", credits: 3, teacher: "TS. Phạm Thu Hà", description: "Mô hình quan hệ, chuẩn hóa và truy vấn SQL." },
  { key: "dsa", code: "CTDL203", name: "Cấu trúc dữ liệu & giải thuật", credits: 4, teacher: "TS. Đỗ Quang Huy", description: "Danh sách, cây, đồ thị và phân tích độ phức tạp." },
  { key: "eng", code: "ENG204", name: "Tiếng Anh chuyên ngành", credits: 2, teacher: "ThS. Nguyễn Hoàng Mai", description: "Đọc hiểu tài liệu kỹ thuật và thuyết trình bằng tiếng Anh." },
  { key: "se", code: "SE305", name: "Nhập môn Công nghệ phần mềm", credits: 3, teacher: "ThS. Trần Bảo Ngọc", description: "Quy trình phát triển phần mềm, Scrum và kiểm thử." },
];

// offset: số ngày so với hôm nay (âm = đã qua)
const TASKS = [
  { subject: "web", title: "Nộp bài tập React Router", offset: -6, priority: "Trung bình", status: "Hoàn thành", note: "Đã demo trên lớp." },
  { subject: "db", title: "Bài tập chuẩn hóa 3NF", offset: -4, priority: "Cao", status: "Hoàn thành", note: "" },
  { subject: "eng", title: "Bài đọc Unit 7 – Cloud Computing", offset: -3, priority: "Thấp", status: "Hoàn thành", note: "" },
  { subject: "dsa", title: "Cài đặt danh sách liên kết đôi", offset: -2, priority: "Cao", status: "Đang làm", note: "Còn thiếu hàm xóa nút." },
  { subject: "se", title: "Viết user story cho đồ án nhóm", offset: -1, priority: "Trung bình", status: "Chưa làm", note: "Thống nhất với nhóm trước buổi họp." },
  { subject: "web", title: "Hoàn thiện API đăng nhập JWT", offset: 1, priority: "Cao", status: "Đang làm", note: "Thêm middleware kiểm tra token." },
  { subject: "db", title: "Ôn tập truy vấn JOIN", offset: 2, priority: "Trung bình", status: "Chưa làm", note: "" },
  { subject: "dsa", title: "Bài tập cây nhị phân tìm kiếm", offset: 4, priority: "Cao", status: "Chưa làm", note: "Làm 3 bài trong file bài tập tuần 9." },
  { subject: "eng", title: "Chuẩn bị slide thuyết trình nhóm", offset: 6, priority: "Trung bình", status: "Hoàn thành", note: "" },
  { subject: "se", title: "Báo cáo Sprint 2", offset: 8, priority: "Cao", status: "Chưa làm", note: "Gồm burndown chart và retrospective." },
];

// Giờ theo tiết (khớp với frontend/src/utils/storage.js)
const PERIOD_START = { 1: "07:00", 2: "07:50", 3: "08:40", 4: "09:40", 5: "10:30", 6: "11:20", 7: "13:00", 8: "13:50", 9: "14:40", 10: "15:40", 11: "16:30", 12: "17:20" };

function periodEnd(period) {
  const [hours, minutes] = PERIOD_START[period].split(":").map(Number);
  const total = hours * 60 + minutes + 45;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const SCHEDULES = [
  { subject: "web", day: "Thứ 2", from: 1, to: 3, room: "B201" },
  { subject: "eng", day: "Thứ 2", from: 7, to: 8, room: "A105" },
  { subject: "db", day: "Thứ 3", from: 4, to: 6, room: "A302" },
  { subject: "se", day: "Thứ 3", from: 7, to: 9, room: "C204" },
  { subject: "dsa", day: "Thứ 4", from: 1, to: 3, room: "C104" },
  { subject: "web", day: "Thứ 4", from: 7, to: 9, room: "Lab 2" },
  { subject: "db", day: "Thứ 5", from: 1, to: 3, room: "Lab 1" },
  { subject: "eng", day: "Thứ 5", from: 4, to: 5, room: "A105" },
  { subject: "dsa", day: "Thứ 6", from: 4, to: 6, room: "C104" },
  { subject: "se", day: "Thứ 6", from: 7, to: 8, room: "C204" },
  { subject: "web", day: "Thứ 7", from: 1, to: 2, room: "Online" },
];

const DOCUMENTS = [
  { subject: "web", title: "Đề cương ôn tập Lập trình Web", file: "de-cuong-lap-trinh-web.pdf", mime: "application/pdf", description: "Tóm tắt nội dung HTML/CSS, JavaScript, React và Express." },
  { subject: "db", title: "Tóm tắt các loại JOIN", file: "on-tap-sql-join.pdf", mime: "application/pdf", description: "Bảng so sánh INNER, LEFT, RIGHT, FULL JOIN kèm ví dụ." },
  { subject: "dsa", title: "Sơ đồ cây nhị phân tìm kiếm", file: "so-do-cay-nhi-phan.png", mime: "image/png", description: "Hình minh họa BST và thứ tự duyệt in-order." },
  { subject: "dsa", title: "Bài tập tuần 9 – BST", file: "bai-tap-cau-truc-du-lieu.pdf", mime: "application/pdf", description: "Ba bài tập về chèn, duyệt và xóa nút trong BST." },
  { subject: "eng", title: "Từ vựng chuyên ngành CNTT", fileName: "tu-vung-it-unit-1-8.docx", fileType: "DOCX", description: "Chỉ lưu thông tin, file giấy được phát trên lớp." },
];

async function request(method, endpoint, { token, body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function expectOk(promise, label) {
  const { status, data } = await promise;
  if (status < 200 || status >= 300) {
    throw new Error(`${label} thất bại (HTTP ${status}): ${data.message || JSON.stringify(data)}`);
  }
  return data;
}

function dueDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(23, 59, 0, 0);
  return date.toISOString();
}

async function getToken() {
  const registered = await request("POST", "/auth/register", { body: DEMO_USER });
  if (registered.status === 201) {
    console.log("Đã tạo tài khoản demo.");
    return registered.data.token;
  }
  if (registered.status !== 409) {
    throw new Error(`Đăng ký thất bại (HTTP ${registered.status}): ${registered.data.message}`);
  }
  const loggedIn = await expectOk(
    request("POST", "/auth/login", { body: { email: DEMO_USER.email, password: DEMO_USER.password } }),
    "Đăng nhập tài khoản demo",
  );
  console.log("Tài khoản demo đã tồn tại, đăng nhập lại.");
  return loggedIn.token;
}

async function clearCollection(token, endpoint) {
  const { data } = await expectOk(request("GET", endpoint, { token }), `Lấy ${endpoint}`).then((result) => ({ data: result.data || [] }));
  for (const item of data) {
    await expectOk(request("DELETE", `${endpoint}/${item._id}`, { token }), `Xóa ${endpoint}`);
  }
  return data.length;
}

async function main() {
  await expectOk(request("GET", "/health"), "Kiểm tra backend").catch((error) => {
    throw new Error(`Không kết nối được backend tại ${API_URL}. Hãy chạy backend trước.\n${error.message}`);
  });

  const token = await getToken();

  for (const endpoint of ["/documents", "/schedules", "/tasks", "/subjects"]) {
    const removed = await clearCollection(token, endpoint);
    if (removed) console.log(`Đã xóa ${removed} bản ghi cũ ở ${endpoint}.`);
  }

  const subjectIds = {};
  // Giao diện hiển thị bản ghi mới nhất trước, nên tạo theo thứ tự ngược
  for (const { key, ...subject } of [...SUBJECTS].reverse()) {
    const created = await expectOk(request("POST", "/subjects", { token, body: subject }), `Tạo môn ${subject.name}`);
    subjectIds[key] = created.data._id;
  }

  for (const { subject, offset, ...task } of TASKS) {
    await expectOk(
      request("POST", "/tasks", { token, body: { ...task, subject: subjectIds[subject], dueDate: dueDate(offset) } }),
      `Tạo deadline ${task.title}`,
    );
  }

  for (const schedule of SCHEDULES) {
    await expectOk(
      request("POST", "/schedules", {
        token,
        body: {
          subject: subjectIds[schedule.subject],
          dayOfWeek: schedule.day,
          startTime: PERIOD_START[schedule.from],
          endTime: periodEnd(schedule.to),
          room: schedule.room,
        },
      }),
      `Tạo lịch ${schedule.day}`,
    );
  }

  for (const documentItem of [...DOCUMENTS].reverse()) {
    const form = new FormData();
    form.append("title", documentItem.title);
    form.append("subject", subjectIds[documentItem.subject]);
    form.append("description", documentItem.description);

    if (documentItem.file) {
      const bytes = fs.readFileSync(path.join(ASSETS_DIRECTORY, documentItem.file));
      form.append("fileName", documentItem.file);
      form.append("file", new Blob([bytes], { type: documentItem.mime }), documentItem.file);
    } else {
      form.append("fileName", documentItem.fileName);
      form.append("fileType", documentItem.fileType);
    }

    await expectOk(request("POST", "/documents", { token, form }), `Tạo tài liệu ${documentItem.title}`);
  }

  console.log(
    `Xong: ${SUBJECTS.length} môn học, ${TASKS.length} deadline, ${SCHEDULES.length} buổi học, ${DOCUMENTS.length} tài liệu cho ${DEMO_USER.email}.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
