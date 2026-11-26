# Study Manager Backend

Backend Node.js + Express cho Study Manager.

## Cài đặt

```bash
npm install
```

## Chạy dev

```bash
npm run dev
```

## Chạy production

```bash
npm start
```

## Environment

Tạo file `.env` từ `.env.example` trước khi chạy:

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/study-manager
JWT_SECRET=replace_with_a_long_random_secret
```

MongoDB phải hoạt động trước khi khởi động backend. Không commit file `.env`.

## Health Check

```text
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "API is running"
}
```

## Upload tài liệu

Endpoint `POST /api/documents` tiếp tục nhận JSON để lưu metadata như trước.
Để upload file thật, gửi request `multipart/form-data` với field file tên là
`file`:

```bash
curl -X POST http://localhost:5050/api/documents \
  -H "Authorization: Bearer <token>" \
  -F "title=Slide React" \
  -F "subject=<subject_id>" \
  -F "description=Tài liệu học React" \
  -F "file=@./react-basic.pdf"
```

Định dạng được phép: PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, GIF và
WEBP. Dung lượng tối đa là 10MB. Response trả `fileUrl` dạng
`/uploads/<stored_file_name>`; có thể mở file tại
`http://localhost:5050<fileUrl>`.

Hướng dẫn cài đặt và luồng demo đầy đủ nằm tại [README gốc](../README.md).

## Dữ liệu demo (chụp ảnh portfolio)

Tài khoản demo và mật khẩu được ghi ở đầu file `backend/scripts/seed-demo.js` (chỉ dùng ở local, không phải thông tin thật).

1. Chạy backend (cổng 5050) và frontend (`http://localhost:5173`).
2. `npm run demo:seed` (ở thư mục gốc) – tạo lại 5 môn học, 10 deadline quanh ngày hiện tại, 11 buổi học và 5 tài liệu cho tài khoản demo. Chạy lại bao nhiêu lần cũng được; chỉ dữ liệu của tài khoản demo bị xóa và tạo lại.
3. `npm run demo:screenshots` – chụp ảnh bằng Playwright vào `demo-screenshots/` (đã nằm trong `.gitignore`).

File tài liệu mẫu nằm ở `backend/scripts/demo-assets/`, tạo lại bằng `npm run demo:assets`. Lần đầu dùng Playwright cần chạy `npx playwright install chromium`.
