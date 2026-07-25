# Quy trình Git cho Study Manager

## 1. Nguyên tắc branch

- `main`: phiên bản ổn định, có thể chạy và trình bày.
- `feature/<ten-chuc-nang>`: phát triển một chức năng cụ thể.
- Không code trực tiếp trên `main`.
- Một branch chỉ nên chứa thay đổi cùng phạm vi.
- Không commit `.env`, `node_modules`, `dist` hoặc `backend/uploads`.

Ví dụ branch:

```text
feature/auth-api
feature/subjects-api
feature/tasks-api
feature/document-upload
feature/frontend-polish
```

## 2. Kiểm tra đúng thư mục Git

Chạy lệnh tại thư mục gốc có `.git`:

```bash
cd C:\Users\zackn\OneDrive\Desktop\study\study-manager
git status
```

Nếu xuất hiện `not a git repository`, cần di chuyển vào đúng thư mục project.

## 3. Tạo feature branch

Đảm bảo thay đổi hiện tại đã được commit hoặc lưu an toàn trước khi chuyển
branch:

```bash
git status
git switch main
git pull origin main
git switch -c feature/ten-chuc-nang
```

Với branch đã tồn tại:

```bash
git switch feature/ten-chuc-nang
```

## 4. Commit thay đổi

Kiểm tra file trước khi commit:

```bash
git status
git diff
git add <file-hoac-thu-muc>
git commit -m "feat: mo ta ngan gon chuc nang"
```

Quy ước message gợi ý:

| Prefix | Sử dụng |
| --- | --- |
| `feat:` | Thêm chức năng |
| `fix:` | Sửa lỗi |
| `docs:` | Cập nhật tài liệu |
| `refactor:` | Chỉnh cấu trúc, không đổi hành vi |
| `test:` | Thêm hoặc sửa kiểm thử |
| `chore:` | Cấu hình, dependency, công việc phụ trợ |

## 5. Kiểm tra trước khi push

Chạy kiểm tra phù hợp với phần đã sửa:

```bash
cd frontend
npm run lint
npm run build
```

Với backend, cần kiểm tra server khởi động, health check và API liên quan:

```bash
cd backend
npm run dev
```

```text
GET http://localhost:5000/api/health
```

## 6. Push và tạo Pull Request

```bash
git push -u origin feature/ten-chuc-nang
```

`Everything up-to-date` nghĩa là remote đã có toàn bộ commit hiện tại. Nếu vừa
sửa file nhưng vẫn thấy thông báo này, kiểm tra xem thay đổi đã được commit hay
chưa bằng `git status` và `git log -1`.

Pull Request cần ghi:

- Mục tiêu thay đổi.
- File/chức năng chính đã sửa.
- Cách kiểm tra.
- Kết quả lint/build/test.
- Phần chưa hoàn thành hoặc rủi ro.

## 7. Merge về main

Sau khi review và kiểm tra:

```bash
git switch main
git pull origin main
git merge --no-ff feature/ten-chuc-nang
git push origin main
```

Sau khi merge có thể xóa branch local:

```bash
git branch -d feature/ten-chuc-nang
```

Chỉ dùng `-D` khi chắc chắn branch không còn thay đổi cần giữ.

## 8. Xử lý conflict

1. Chạy `git status` để xem file conflict.
2. Mở từng file và chọn nội dung đúng.
3. Xóa các marker `<<<<<<<`, `=======`, `>>>>>>>`.
4. Chạy lại lint/build/test.
5. `git add` file đã xử lý rồi commit.

Không dùng `git reset --hard` hoặc xóa file hàng loạt khi chưa sao lưu thay đổi.

