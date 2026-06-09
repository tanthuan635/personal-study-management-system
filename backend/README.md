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

Tạo file `.env` từ `.env.example` nếu cần chạy với cấu hình riêng.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

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

Branch này chỉ setup Express cơ bản, chưa kết nối MongoDB.
