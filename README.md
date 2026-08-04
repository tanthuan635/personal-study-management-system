# Study Manager

Study Manager là ứng dụng quản lý học tập cá nhân gồm frontend React Vite và
backend Node.js, Express, MongoDB. Hệ thống hỗ trợ xác thực JWT, quản lý môn học,
deadline, lịch học, tài liệu và thống kê tiến độ.

## Yêu cầu môi trường

- Node.js `^20.19.0` hoặc `>=22.12.0`
- npm
- MongoDB đang chạy trên máy hoặc một MongoDB URI hợp lệ

## Cài đặt

Từ thư mục gốc của project, cài dependency cho root, backend và frontend:

```bash
npm install
npm run install:all
```

## Cấu hình backend

Tạo `backend/.env` từ `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/study-manager
JWT_SECRET=replace_with_a_long_random_secret
```

Không commit file `.env`. Nếu dùng MongoDB Compass, URI local ở trên có thể
được dùng khi MongoDB đang chạy trên máy.

## Cấu hình frontend

Frontend mặc định gọi `http://localhost:5000/api`. Khi cần cấu hình riêng, tạo
`frontend/.env` từ `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Chạy project

Sau khi MongoDB đã hoạt động và `backend/.env` đã được cấu hình, chạy từ thư
mục gốc:

```bash
npm run dev
```

Lệnh này khởi động đồng thời backend và frontend. Nhấn `Ctrl+C` một lần để dừng
cả hai. Khi cần debug riêng từng phần, dùng:

```bash
npm run dev:backend
npm run dev:frontend
```

Mở địa chỉ Vite in ra terminal, thường là `http://localhost:5173`. API health
check ở `http://localhost:5000/api/health`.

## Luồng demo

1. Đăng ký tài khoản mới hoặc đăng nhập.
2. Tạo môn học.
3. Tạo deadline và chọn môn học vừa tạo.
4. Tạo lịch học cho môn học.
5. Thêm metadata tài liệu hoặc chọn file để upload.
6. Mở Dashboard và Thống kê để xem dữ liệu tổng hợp.
7. Kiểm tra sửa, đổi trạng thái và xóa dữ liệu ở từng trang.

File upload hỗ trợ PDF, DOC, DOCX, PPT, PPTX và ảnh JPG, JPEG, PNG, GIF, WEBP,
tối đa 10MB. File được lưu trong `backend/uploads` và không được commit.

## Kiểm tra frontend

```bash
cd frontend
npm run lint
npm run build
```

Backend hiện không có test runner riêng. Có thể kiểm tra cú pháp và chạy dev:

```bash
cd backend
node --check src/server.js
npm run dev
```

## Tài liệu

- [API](docs/API.md)
- [Cơ sở dữ liệu](docs/DATABASE.md)
- [Chức năng](docs/FEATURES.md)
- [Quy trình Git](docs/GIT_WORKFLOW.md)
- [Dàn ý báo cáo](docs/REPORT_OUTLINE.md)

