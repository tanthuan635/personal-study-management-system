# Chức năng hệ thống Study Manager

## 1. Xác thực người dùng

- Đăng ký tài khoản bằng họ tên, email và mật khẩu.
- Đăng nhập bằng email/mật khẩu.
- Mật khẩu được băm bằng bcrypt.
- JWT được lưu ở frontend và tự gắn vào request API.
- Chặn trang chính khi chưa đăng nhập.
- Đăng xuất bằng cách xóa token và thông tin user.
- Mỗi user chỉ quản lý dữ liệu của chính mình.

## 2. Dashboard

- Hiển thị tổng số môn học và deadline.
- Hiển thị deadline hoàn thành, chưa hoàn thành, quá hạn và sắp tới.
- Hiển thị tỷ lệ hoàn thành.
- Có loading, thông báo lỗi và trạng thái chưa có dữ liệu.

## 3. Quản lý môn học

- Xem danh sách môn học.
- Thêm, sửa và xóa môn học.
- Tìm theo tên hoặc mã môn.
- Lưu giảng viên, số tín chỉ và mô tả.
- Dữ liệu được lưu trong MongoDB theo user.

## 4. Quản lý deadline

- Xem, thêm, sửa và xóa deadline.
- Chuyển trạng thái: `Chưa làm`, `Đang làm`, `Hoàn thành`.
- Chọn độ ưu tiên: `Thấp`, `Trung bình`, `Cao`.
- Lọc theo môn học, trạng thái và độ ưu tiên.
- Sắp xếp deadline gần nhất.
- Cảnh báo deadline quá hạn hoặc sắp tới.

## 5. Quản lý lịch học

- Xem lịch theo thứ trong tuần.
- Thêm, sửa và xóa lịch học.
- Lọc lịch theo môn học.
- Giao diện chọn tiết 1-12.
- Tiết 1 bắt đầu lúc 07:00, tiết 7 bắt đầu lúc 13:00.
- Mỗi tiết dài 45 phút; nghỉ 5 phút, riêng sau tiết 3 và tiết 9 nghỉ 15 phút.
- Frontend chuyển tiết học thành giờ để lưu vào backend.

## 6. Quản lý tài liệu

- Xem, tìm kiếm, lọc, thêm, sửa và xóa metadata tài liệu.
- Phân loại tài liệu theo môn học.
- Backend hỗ trợ upload file thật bằng Multer.
- Frontend cho phép chọn file, kiểm tra định dạng/dung lượng và gửi
`multipart/form-data`.
- Hỗ trợ PDF, Word, PowerPoint và ảnh cơ bản, tối đa 10MB.
- File có thể được mở hoặc tải xuống từ card tài liệu qua static URL `/uploads`.
- Xóa Document đã upload sẽ xóa cả file vật lý.
- Luồng chỉ lưu metadata vẫn được giữ khi người dùng không chọn file thật.

## 7. Thống kê

- Tổng số môn học và deadline.
- Số deadline hoàn thành và chưa hoàn thành.
- Tỷ lệ hoàn thành.
- Số deadline quá hạn.
- Số deadline chưa hoàn thành trong 7 ngày tới.
- Dashboard và trang Statistics lấy dữ liệu từ API thật.

## 8. Giao diện và trải nghiệm

- Login/Register và các trang chính có route riêng.
- Sidebar, Header và MainLayout dùng chung.
- Có trạng thái loading, rỗng, lỗi và thông báo thành công cơ bản.
- Có confirm trước khi xóa dữ liệu.
- Bố cục responsive theo kích thước màn hình.

## 9. Ngoài phạm vi hiện tại

- Chưa có quên mật khẩu, xác thực email hoặc đăng nhập mạng xã hội.
- Chưa có thông báo deadline qua email/push notification.
- Chưa có phân quyền quản trị hoàn chỉnh dù User đã có field `role`.
- Chưa có chia sẻ môn học/tài liệu giữa nhiều user.
- Chưa có bộ automated test chính thức.
