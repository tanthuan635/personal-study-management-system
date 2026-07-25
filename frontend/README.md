# Study Manager Frontend

Frontend React Vite cho ứng dụng Study Manager. Dữ liệu nghiệp vụ được lấy từ
backend API; `localStorage` chỉ lưu token và thông tin phiên đăng nhập.

## Cấu hình

Tạo `.env` từ `.env.example` khi backend không chạy ở địa chỉ mặc định:

```env
VITE_API_URL=http://localhost:5000/api
```

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Backend và MongoDB cần được khởi động trước để đăng nhập và thao tác dữ liệu.

## Kiểm tra

```bash
npm run lint
npm run build
```

Các trang chính gồm Dashboard, Môn học, Deadline, Lịch học, Tài liệu và Thống
kê. Hướng dẫn cài đặt đầy đủ nằm tại [README gốc](../README.md).
