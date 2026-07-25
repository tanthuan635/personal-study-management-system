# Thiết kế cơ sở dữ liệu Study Manager

## 1. Tổng quan

Hệ thống sử dụng MongoDB và Mongoose. Các collection chính:

- `users`
- `subjects`
- `tasks`
- `schedules`
- `documents`

Mỗi document có `_id` kiểu ObjectId. Tất cả model bật `timestamps: true`, vì
vậy MongoDB tự lưu `createdAt` và `updatedAt`.

Quan hệ tổng quát:

```text
User
├── Subject
├── Task ──────── Subject (không bắt buộc)
├── Schedule ──── Subject (không bắt buộc)
└── Document ──── Subject (không bắt buộc)
```

Subject, Task, Schedule và Document đều có field `user`. Backend dùng field
này để đảm bảo mỗi tài khoản chỉ truy cập dữ liệu của chính mình.

## 2. User

| Field | Kiểu | Ràng buộc |
| --- | --- | --- |
| `name` | String | Bắt buộc, trim |
| `email` | String | Bắt buộc, unique, lowercase, trim |
| `password` | String | Bắt buộc, lưu dạng bcrypt hash |
| `role` | String | `user` hoặc `admin`, mặc định `user` |
| `createdAt` | Date | Tự động |
| `updatedAt` | Date | Tự động |

Password không được trả về trong API xác thực.

## 3. Subject

| Field | Kiểu | Ràng buộc |
| --- | --- | --- |
| `user` | ObjectId → User | Bắt buộc |
| `name` | String | Bắt buộc, trim |
| `code` | String | Bắt buộc, trim |
| `teacher` | String | Mặc định chuỗi rỗng |
| `credits` | Number | Bắt buộc, tối thiểu 0 |
| `description` | String | Mặc định chuỗi rỗng |
| `createdAt` | Date | Tự động |
| `updatedAt` | Date | Tự động |

## 4. Task

| Field | Kiểu | Ràng buộc |
| --- | --- | --- |
| `user` | ObjectId → User | Bắt buộc |
| `subject` | ObjectId → Subject | Không bắt buộc |
| `title` | String | Bắt buộc, trim |
| `dueDate` | Date | Bắt buộc |
| `priority` | String | `Thấp`, `Trung bình`, `Cao` |
| `status` | String | `Chưa làm`, `Đang làm`, `Hoàn thành` |
| `note` | String | Mặc định chuỗi rỗng |
| `createdAt` | Date | Tự động |
| `updatedAt` | Date | Tự động |

Mặc định `priority` là `Trung bình`, `status` là `Chưa làm`.

## 5. Schedule

| Field | Kiểu | Ràng buộc |
| --- | --- | --- |
| `user` | ObjectId → User | Bắt buộc |
| `subject` | ObjectId → Subject | Không bắt buộc |
| `dayOfWeek` | String | Bắt buộc |
| `startTime` | String | Bắt buộc, định dạng sử dụng `HH:mm` |
| `endTime` | String | Bắt buộc, định dạng sử dụng `HH:mm` |
| `room` | String | Mặc định chuỗi rỗng |
| `note` | String | Mặc định chuỗi rỗng |
| `createdAt` | Date | Tự động |
| `updatedAt` | Date | Tự động |

Controller giới hạn `dayOfWeek` từ `Thứ 2` đến `Chủ nhật`. Giao diện chuyển
tiết học sang giờ trước khi gọi API.

## 6. Document

| Field | Kiểu | Ràng buộc |
| --- | --- | --- |
| `user` | ObjectId → User | Bắt buộc |
| `subject` | ObjectId → Subject | Không bắt buộc |
| `title` | String | Bắt buộc, trim |
| `fileName` | String | Bắt buộc, tên file gốc hoặc tên metadata |
| `fileUrl` | String | URL static, mặc định chuỗi rỗng |
| `fileType` | String | Phần mở rộng file, mặc định chuỗi rỗng |
| `storedFileName` | String | Tên nội bộ trên đĩa, ẩn khỏi API |
| `description` | String | Mặc định chuỗi rỗng |
| `createdAt` | Date | Tự động |
| `updatedAt` | Date | Tự động |

File vật lý được lưu tại `backend/uploads`. Khi xóa Document, backend dùng
`storedFileName` để xóa đúng file vật lý. Field này có `select: false` và
được loại khỏi JSON response.

## 7. Toàn vẹn và giới hạn hiện tại

- User chỉ được gắn Task, Schedule hoặc Document với Subject thuộc chính user.
- `email` là field duy nhất có unique index được khai báo rõ trong schema.
- Chưa có API xóa User và chưa có cơ chế cascade toàn bộ dữ liệu theo User.
- Khi xóa Subject, backend chưa tự động xóa Task, Schedule hoặc Document đang
tham chiếu đến Subject đó.
- MongoDB lưu tham chiếu bằng ObjectId; API hiện không dùng transaction.

