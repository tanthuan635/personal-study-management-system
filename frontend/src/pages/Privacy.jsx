import { useEffect } from "react";
import { Link } from "react-router-dom";

const privacySections = [
  {
    title: "Thông tin tài khoản",
    description:
      "Hệ thống sử dụng họ tên và email để tạo tài khoản, nhận diện người dùng và hiển thị thông tin cá nhân trong ứng dụng. Mật khẩu được xử lý ở backend và không được trả về giao diện.",
  },
  {
    title: "Dữ liệu học tập",
    description:
      "Môn học, deadline, lịch học, tài liệu và số liệu tiến độ được gắn với tài khoản đã đăng nhập. API chỉ truy vấn dữ liệu thuộc người dùng hiện tại.",
  },
  {
    title: "Tệp tài liệu",
    description:
      "Tài liệu do người dùng tải lên được lưu tại máy chủ triển khai để phục vụ chức năng xem trước. Không tải lên tệp chứa thông tin nhạy cảm khi dùng bản demo công khai.",
  },
  {
    title: "Phiên đăng nhập",
    description:
      "Frontend lưu token và thông tin người dùng trong localStorage để duy trì phiên. Đăng xuất sẽ xóa dữ liệu phiên khỏi trình duyệt hiện tại.",
  },
];

function Privacy() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Quyền riêng tư | Study Manager";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex h-[72px] w-full max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#4f8edc] text-xs font-black text-white">
              SM
            </span>
            <span className="brand-name text-base text-[#183b5b]">Study Manager</span>
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-[#3979c2] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Về trang chủ
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
          Thông tin dữ liệu
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-[#123552] sm:text-5xl">
          Quyền riêng tư
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Trang này mô tả cách phiên bản hiện tại của Study Manager sử dụng dữ
          liệu để cung cấp các chức năng quản lý học tập.
        </p>

        <div className="mt-12 border-t border-blue-100">
          {privacySections.map((section, index) => (
            <section
              key={section.title}
              className="grid gap-3 border-b border-blue-100 py-8 sm:grid-cols-[48px_1fr] sm:gap-6"
            >
              <span className="text-sm font-black text-blue-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {section.description}
                </p>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 border border-blue-100 bg-white p-5 text-sm leading-7 text-slate-600 sm:p-6">
          Đây là tài liệu quyền riêng tư cho đồ án học tập. Khi triển khai thực tế,
          người vận hành cần bổ sung chính sách lưu trữ, sao lưu và xóa dữ liệu phù
          hợp với môi trường triển khai.
        </div>
      </main>
    </div>
  );
}

export default Privacy;
