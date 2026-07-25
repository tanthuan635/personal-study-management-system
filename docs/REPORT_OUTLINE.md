# Dàn ý báo cáo khóa luận Study Manager

## Chương 1. Tổng quan đề tài

### 1.1. Lý do chọn đề tài

- Khó khăn khi sinh viên quản lý môn học, deadline, lịch học và tài liệu ở
nhiều công cụ khác nhau.
- Nhu cầu có một hệ thống tập trung, đơn giản và dễ sử dụng.

### 1.2. Mục tiêu

- Xây dựng ứng dụng web Study Manager.
- Quản lý dữ liệu riêng theo từng tài khoản.
- Theo dõi tiến độ học tập và deadline.

### 1.3. Đối tượng và phạm vi

- Đối tượng sử dụng: sinh viên.
- Phạm vi: xác thực, môn học, deadline, lịch học, tài liệu và thống kê.
- Nêu rõ các chức năng chưa triển khai như email notification hoặc chia sẻ dữ
liệu.

### 1.4. Phương pháp thực hiện

- Khảo sát nhu cầu.
- Phân tích yêu cầu.
- Thiết kế giao diện, API và cơ sở dữ liệu.
- Xây dựng, tích hợp và kiểm thử.

### 1.5. Cấu trúc báo cáo

Tóm tắt nội dung của năm chương.

## Chương 2. Cơ sở lý thuyết

### 2.1. Kiến trúc ứng dụng web

- Client-server.
- REST API.
- JSON và HTTP status code.

### 2.2. Công nghệ frontend

- React.
- Vite.
- React Router.
- Axios.
- Tailwind CSS.

### 2.3. Công nghệ backend

- Node.js.
- Express.
- Middleware, CORS và Morgan.
- Multer và multipart/form-data.

### 2.4. Cơ sở dữ liệu

- MongoDB.
- Mongoose Schema, Model, ObjectId và quan hệ tham chiếu.

### 2.5. Bảo mật

- Băm mật khẩu bằng bcrypt.
- Xác thực JWT và Bearer token.
- Phân tách dữ liệu theo user.
- Kiểm tra loại và dung lượng file upload.

### 2.6. Công cụ phát triển

- Git/GitHub.
- MongoDB Compass.
- Postman hoặc công cụ kiểm tra API.

## Chương 3. Phân tích và thiết kế hệ thống

### 3.1. Khảo sát và yêu cầu

- Yêu cầu chức năng.
- Yêu cầu phi chức năng: bảo mật, dễ dùng, responsive, khả năng bảo trì.

### 3.2. Tác nhân và use case

- Tác nhân chính: người dùng/sinh viên.
- Use case đăng ký, đăng nhập, quản lý dữ liệu và xem thống kê.
- Vẽ sơ đồ use case tổng quát.

### 3.3. Phân tích luồng nghiệp vụ

- Luồng đăng ký/đăng nhập.
- Luồng CRUD môn học, deadline, lịch học, tài liệu.
- Luồng upload và mở file.
- Luồng tổng hợp thống kê.

### 3.4. Thiết kế kiến trúc

- Sơ đồ React frontend → Express API → MongoDB.
- Vai trò của route, middleware, controller và model.

### 3.5. Thiết kế cơ sở dữ liệu

- Sơ đồ quan hệ User, Subject, Task, Schedule, Document.
- Mô tả field, ràng buộc và quyền sở hữu dữ liệu.

### 3.6. Thiết kế API

- Nhóm endpoint Auth, Subjects, Tasks, Schedules, Documents, Statistics.
- Chuẩn request, response, xác thực và xử lý lỗi.

### 3.7. Thiết kế giao diện

- Wireframe hoặc ảnh thiết kế Login, Dashboard và các trang quản lý.
- Layout dùng chung, responsive và trạng thái loading/error/empty.

## Chương 4. Xây dựng và kiểm thử hệ thống

### 4.1. Môi trường và cấu hình

- Cấu trúc project frontend/backend.
- Cài dependency và cấu hình `.env`.
- Kết nối MongoDB.

### 4.2. Xây dựng backend

- Express server và middleware.
- JWT authentication.
- CRUD API và kiểm tra quyền theo user.
- API thống kê.
- Upload file bằng Multer và static route.

### 4.3. Xây dựng frontend

- Router, trang bảo vệ và layout.
- Lớp gọi API Axios.
- Form, danh sách, filter và thông báo.
- Dashboard và Statistics.

### 4.4. Tích hợp hệ thống

- Lưu token và gửi Bearer token.
- Gửi/nhận JSON.
- Gửi multipart/form-data.
- Cập nhật giao diện theo response.

### 4.5. Kiểm thử

- Lập bảng test case: mã, mục tiêu, dữ liệu vào, kết quả mong đợi, kết quả thực
tế.
- Kiểm thử auth đúng/sai.
- Kiểm thử CRUD và quyền truy cập giữa hai user.
- Kiểm thử filter, search và thống kê.
- Kiểm thử file hợp lệ, sai định dạng và lớn hơn 10MB.
- Kiểm thử responsive, loading, empty state và lỗi mất kết nối.

### 4.6. Kết quả

- Ảnh chụp các màn hình chính.
- Ảnh response API/Postman.
- Kết quả lint, build và smoke test.
- Đánh giá mức độ đáp ứng yêu cầu.

## Chương 5. Kết luận và hướng phát triển

### 5.1. Kết quả đạt được

- Tóm tắt chức năng đã hoàn thành.
- Đánh giá ưu điểm của hệ thống.

### 5.2. Hạn chế

- Chưa có thông báo tự động.
- Chưa có chia sẻ dữ liệu hoặc phân quyền admin hoàn chỉnh.
- Static file upload hiện chưa có route download được bảo vệ riêng.
- Chưa có bộ automated test đầy đủ.

### 5.3. Hướng phát triển

- Bổ sung preview file trực tiếp và route download có xác thực.
- Email/push notification cho deadline.
- Lịch dạng calendar và đồng bộ lịch ngoài.
- Tìm kiếm nâng cao, phân trang và dashboard chi tiết.
- Cloud storage, bảo vệ file và triển khai production.
- Bổ sung unit test, integration test và CI/CD.

## Phụ lục gợi ý

- Danh sách endpoint.
- Cấu trúc collection MongoDB.
- Hướng dẫn cài đặt và chạy project.
- Link repository và lịch sử branch/commit.
- Kịch bản demo khi bảo vệ.
