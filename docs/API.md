# Tài liệu API Study Manager

## 1. Thông tin chung

- Base URL mặc định: `http://localhost:5000/api`
- Frontend cấu hình qua biến môi trường `VITE_API_URL`.
- Request JSON sử dụng header `Content-Type: application/json`.
- Các API nghiệp vụ yêu cầu JWT:

```http
Authorization: Bearer <token>
```

- Dữ liệu của Subjects, Tasks, Schedules, Documents và Statistics luôn được
lọc theo người dùng đang đăng nhập.

Response thành công phổ biến:

```json
{
  "success": true,
  "data": {}
}
```

Response lỗi phổ biến:

```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```

| Status | Ý nghĩa |
| --- | --- |
| `200` | Request thành công |
| `201` | Tạo dữ liệu thành công |
| `400` | Dữ liệu hoặc ID không hợp lệ |
| `401` | Thiếu token, token sai hoặc đăng nhập thất bại |
| `403` | Không có quyền truy cập dữ liệu |
| `404` | Không tìm thấy dữ liệu hoặc route |
| `409` | Email đã tồn tại |
| `500` | Lỗi cấu hình hoặc lỗi máy chủ |

## 2. Health check

| Method | Endpoint | Xác thực | Mô tả |
| --- | --- | --- | --- |
| GET | `/api/health` | Không | Kiểm tra API đang hoạt động |

```json
{
  "success": true,
  "message": "API is running"
}
```

## 3. Authentication

| Method | Endpoint | Xác thực | Mô tả |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Không | Đăng ký tài khoản |
| POST | `/api/auth/login` | Không | Đăng nhập |
| GET | `/api/auth/me` | Có | Lấy người dùng hiện tại |

Request đăng ký:

```json
{
  "name": "Nguyen Van A",
  "email": "student@example.com",
  "password": "123456"
}
```

Request đăng nhập:

```json
{
  "email": "student@example.com",
  "password": "123456"
}
```

Response đăng ký/đăng nhập:

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Nguyen Van A",
    "email": "student@example.com"
  }
}
```

`GET /api/auth/me` trả `success` và `user`, không bọc user trong `data`.
Password được băm bằng bcrypt và không xuất hiện trong response.

## 4. Subjects

Tất cả endpoint trong nhóm này cần JWT.

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/subjects` | Lấy môn học của user |
| GET | `/api/subjects/:id` | Lấy một môn học |
| POST | `/api/subjects` | Tạo môn học |
| PUT | `/api/subjects/:id` | Cập nhật môn học |
| DELETE | `/api/subjects/:id` | Xóa môn học |

Query của danh sách:

| Query | Mô tả |
| --- | --- |
| `search` | Tìm không phân biệt hoa thường theo `name` hoặc `code` |

Body tạo môn học:

```json
{
  "name": "Lập trình Web",
  "code": "WEB101",
  "teacher": "Nguyễn Văn A",
  "credits": 3,
  "description": "Môn học về lập trình giao diện web"
}
```

`name`, `code`, `credits` là bắt buộc. `credits` phải là số không âm.
Danh sách được sắp xếp theo dữ liệu tạo mới nhất.

## 5. Tasks

Tất cả endpoint trong nhóm này cần JWT.

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/tasks` | Lấy danh sách deadline |
| GET | `/api/tasks/:id` | Lấy một deadline |
| POST | `/api/tasks` | Tạo deadline |
| PUT | `/api/tasks/:id` | Cập nhật deadline |
| PATCH | `/api/tasks/:id/status` | Chỉ cập nhật trạng thái |
| DELETE | `/api/tasks/:id` | Xóa deadline |

Query của danh sách:

| Query | Giá trị |
| --- | --- |
| `subject` | MongoDB ObjectId của môn học |
| `status` | `Chưa làm`, `Đang làm`, `Hoàn thành` |
| `priority` | `Thấp`, `Trung bình`, `Cao` |

Kết quả được sắp xếp theo `dueDate` gần nhất, sau đó theo `createdAt`.

Body tạo deadline:

```json
{
  "title": "Làm bài tập React",
  "subject": "subject_id",
  "dueDate": "2026-06-10",
  "priority": "Cao",
  "status": "Chưa làm",
  "note": "Hoàn thành component quản lý môn học"
}
```

`title` và `dueDate` là bắt buộc. `subject` có thể bỏ trống; nếu có thì phải
là môn học của user hiện tại.

Body cập nhật trạng thái:

```json
{
  "status": "Hoàn thành"
}
```

## 6. Schedules

Tất cả endpoint trong nhóm này cần JWT.

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/schedules` | Lấy danh sách lịch học |
| GET | `/api/schedules/:id` | Lấy một lịch học |
| POST | `/api/schedules` | Tạo lịch học |
| PUT | `/api/schedules/:id` | Cập nhật lịch học |
| DELETE | `/api/schedules/:id` | Xóa lịch học |

Query của danh sách:

| Query | Giá trị |
| --- | --- |
| `subject` | MongoDB ObjectId của môn học |
| `dayOfWeek` | `Thứ 2` đến `Thứ 7` hoặc `Chủ nhật` |

Body tạo lịch học:

```json
{
  "subject": "subject_id",
  "dayOfWeek": "Thứ 2",
  "startTime": "07:00",
  "endTime": "09:25",
  "room": "A101",
  "note": "Học lý thuyết"
}
```

`dayOfWeek`, `startTime`, `endTime` là bắt buộc. Frontend đang cho người dùng
chọn tiết 1-12 rồi chuyển thành `startTime` và `endTime` trước khi gửi.
Danh sách được sắp xếp theo thứ trong tuần và giờ bắt đầu.

## 7. Documents

Tất cả endpoint trong nhóm này cần JWT.

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/documents` | Lấy danh sách tài liệu |
| GET | `/api/documents/:id` | Lấy một tài liệu |
| POST | `/api/documents` | Tạo metadata hoặc upload file |
| PUT | `/api/documents/:id` | Cập nhật metadata |
| DELETE | `/api/documents/:id` | Xóa metadata và file đã upload |

Query của danh sách:

| Query | Mô tả |
| --- | --- |
| `subject` | Lọc theo MongoDB ObjectId của môn học |
| `search` | Tìm không phân biệt hoa thường theo `title` hoặc `fileName` |

### Tạo metadata bằng JSON

```json
{
  "title": "Slide React cơ bản",
  "subject": "subject_id",
  "fileName": "react-basic.pdf",
  "fileUrl": "",
  "fileType": "PDF",
  "description": "Tài liệu học React"
}
```

`title` và `fileName` là bắt buộc.

### Upload file bằng multipart/form-data

Field file phải có tên `file`. Các field text gồm `title`, `subject` và
`description`. Khi có file, server tự tạo `fileName`, `fileUrl` và `fileType`.

```bash
curl -X POST http://localhost:5000/api/documents \
  -H "Authorization: Bearer <token>" \
  -F "title=Slide React" \
  -F "subject=<subject_id>" \
  -F "description=Tài liệu học React" \
  -F "file=@./react-basic.pdf"
```

- Dung lượng tối đa: 10MB.
- Định dạng: PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, GIF, WEBP.
- File được lưu trong `backend/uploads`.
- URL file có dạng `/uploads/<stored_file_name>`.
- Mở file bằng `http://localhost:5000<fileUrl>`.
- Static URL `/uploads` hiện không yêu cầu JWT.
- `PUT /api/documents/:id` hiện chỉ cập nhật metadata, chưa thay file.

### Kiểm tra upload trên giao diện

1. Đăng nhập và tạo ít nhất một môn học.
2. Mở trang **Tài liệu** và nhấn **Thêm tài liệu**.
3. Nhập tên tài liệu, chọn môn học và chọn file hợp lệ không quá 10MB.
4. Nhấn **Tải tài liệu lên**.
5. Sau khi thành công, dùng nút **Mở file** hoặc **Tải xuống** trên card.
6. Bỏ trống input file, nhập tên file metadata và loại tài liệu để kiểm tra luồng
lưu metadata cũ.
7. Thử file sai định dạng hoặc lớn hơn 10MB để kiểm tra thông báo lỗi.

## 8. Statistics

| Method | Endpoint | Xác thực | Mô tả |
| --- | --- | --- | --- |
| GET | `/api/statistics/overview` | Có | Thống kê theo user hiện tại |

Response:

```json
{
  "success": true,
  "data": {
    "totalSubjects": 5,
    "totalTasks": 12,
    "completedTasks": 7,
    "pendingTasks": 5,
    "completionRate": 58,
    "overdueTasks": 2,
    "upcomingTasks": 3
  }
}
```

- `overdueTasks`: deadline chưa hoàn thành và có `dueDate` trước hôm nay.
- `upcomingTasks`: deadline chưa hoàn thành, từ hôm nay đến trước thời điểm
7 ngày tiếp theo.
