# DELIVERY MODE

## Mục tiêu

* Ưu tiên hoàn thành chức năng nhanh, ổn định và đúng phạm vi.
* Codex được phép trực tiếp tạo, sửa và hoàn thiện code.
* Không yêu cầu người dùng tự gõ hoặc tự viết lại code.
* Không dừng lại sau từng đoạn nhỏ, trừ khi gặp yêu cầu chưa rõ hoặc có nguy cơ làm hỏng chức năng hiện có.

## Trước khi sửa

1. Đọc các file liên quan.
2. Xác định luồng chạy hiện tại.
3. Nêu kế hoạch ngắn gọn.
4. Chỉ sửa những phần cần thiết.
5. Không thay đổi backend, frontend, database hoặc giao diện ngoài phạm vi yêu cầu.

## Trong khi sửa

* Có thể sửa hoàn chỉnh nhiều file nếu chức năng yêu cầu.
* Giữ nguyên cấu trúc và phong cách code hiện tại khi hợp lý.
* Không xóa chức năng đang hoạt động.
* Không thay đổi API contract nếu chưa được yêu cầu.
* Không cài thêm thư viện nếu chưa thực sự cần.
* Không che lỗi bằng dữ liệu giả hoặc hard-code chỉ để giao diện trông như đang hoạt động.
* Xử lý loading, lỗi và trường hợp dữ liệu rỗng khi cần thiết.

## Sau khi sửa

1. Liệt kê các file đã tạo hoặc chỉnh sửa.
2. Tóm tắt thay đổi trong từng file.
3. Chạy các kiểm tra phù hợp như lint, type-check, test hoặc build.
4. Báo rõ kiểm tra nào thành công và kiểm tra nào thất bại.
5. Giải thích luồng chức năng bằng tiếng Việt dễ hiểu.
6. Nêu cách người dùng tự kiểm tra chức năng trên giao diện.
7. Nêu những phần chưa thể xác nhận hoặc vẫn còn rủi ro.
8. Dừng lại và chờ người dùng kiểm tra thực tế.

## Cách giải thích

Sau khi hoàn thành, hãy giải thích:

* Người dùng thao tác gì đầu tiên.
* File hoặc component nào tiếp nhận thao tác.
* Hàm nào được gọi.
* Dữ liệu được gửi đi đâu.
* Backend xử lý ở đâu nếu có.
* Response trả về như thế nào.
* Giao diện cập nhật ra sao.
* Các lỗi thường có thể xuất hiện ở đâu.

## Quy tắc sửa lỗi

Khi người dùng báo lỗi:

1. Đọc thông báo lỗi và code liên quan.
2. Xác định nguyên nhân gốc trước khi sửa.
3. Chỉ sửa phần liên quan.
4. Không viết lại toàn bộ chức năng nếu không cần.
5. Chạy lại kiểm tra sau khi sửa.
6. Giải thích nguyên nhân và cách đã khắc phục.
