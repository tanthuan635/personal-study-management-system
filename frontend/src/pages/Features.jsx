import { useEffect } from "react";
import { Link } from "react-router-dom";

import LandingLayout from "../components/landing/LandingLayout";

const features = [
  {
    number: "01",
    eyebrow: "Tổng quan",
    title: "Dashboard và thống kê tiến độ",
    description:
      "Xem tổng quan môn học và tiến độ xử lý deadline để biết phần việc đã xong, phần còn lại và những hạn nộp cần chú ý.",
    details: [
      "Tổng hợp số môn học, deadline, deadline đã hoàn thành và chưa hoàn thành.",
      "Hiển thị tỷ lệ hoàn thành, deadline quá hạn và deadline đến hạn trong 7 ngày tới.",
    ],
  },
  {
    number: "02",
    eyebrow: "Môn học",
    title: "Quản lý danh sách môn học",
    description:
      "Lưu các môn đang học và liên kết deadline, lịch học, tài liệu với từng môn để dễ tổ chức và tra cứu.",
    details: [
      "Lưu tên môn, mã môn, giảng viên, số tín chỉ và mô tả.",
      "Tìm kiếm môn học theo tên hoặc mã; thêm, sửa và xóa môn học.",
    ],
  },
  {
    number: "03",
    eyebrow: "Deadline",
    title: "Theo dõi công việc và hạn nộp",
    description:
      "Ghi lại từng công việc, ngày đến hạn và trạng thái xử lý để chọn việc cần ưu tiên và theo dõi đến khi hoàn thành.",
    details: [
      "Gắn deadline với môn học, chọn mức ưu tiên và lưu ghi chú.",
      "Lọc danh sách theo trạng thái hoặc mức ưu tiên; cập nhật trạng thái công việc.",
    ],
  },
  {
    number: "04",
    eyebrow: "Lịch học",
    title: "Sắp xếp thời khóa biểu trong tuần",
    description:
      "Xem các buổi học theo thứ và tiết để biết khi nào học môn gì, ở phòng nào và chủ động sắp xếp kế hoạch trong tuần.",
    details: [
      "Ghi môn học, thứ, tiết bắt đầu và kết thúc, phòng học và ghi chú.",
      "Xem các buổi học trong bảng thời khóa biểu và lọc theo môn học.",
    ],
  },
  {
    number: "05",
    eyebrow: "Tài liệu",
    title: "Lưu tài liệu theo môn học",
    description:
      "Lưu thông tin hoặc tải file tài liệu lên theo môn để dễ tìm lại khi làm bài và ôn tập.",
    details: [
      "Tìm tài liệu theo tên, tên file hoặc loại file; lọc danh sách theo môn học.",
      "Tải lên PDF, Word, PowerPoint và ảnh với dung lượng tối đa 10 MB; mở file đã tải trong trang xem tài liệu.",
    ],
  },
];

function Features() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Tính năng | Study Manager";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <LandingLayout>
      <main>
        <section aria-labelledby="features-title" className="landing-hero bg-[#fafdff]">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
              Tính năng hiện có
            </p>
            <h1
              id="features-title"
              className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-[-0.045em] text-[#123552] sm:text-5xl"
            >
              Những phần chính trong kế hoạch học tập của bạn.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Study Manager hiện hỗ trợ quản lý môn học, deadline, lịch học,
              tài liệu và theo dõi tiến độ từ dữ liệu của tài khoản.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-black text-[#2f689f] transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-label="Chi tiết các tính năng"
          className="bg-white py-16 sm:py-20"
        >
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="border-t border-blue-100">
              {features.map((feature) => (
                <article
                  key={feature.number}
                  className="grid gap-6 border-b border-blue-100 py-9 sm:py-11 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-blue-500">
                        {feature.number}
                      </span>
                      <span className="h-px w-10 bg-blue-200" />
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        {feature.eyebrow}
                      </p>
                    </div>
                    <h2 className="mt-5 text-2xl font-black leading-tight tracking-[-0.035em] text-slate-900 sm:text-3xl">
                      {feature.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-3 rounded-2xl border border-blue-100 bg-[#f7fbff] p-5 sm:p-6">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex gap-3 text-sm leading-6 text-slate-700"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-blue-100 text-xs font-black text-blue-600"
                        >
                          ✓
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eaf4ff]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                Bắt đầu sử dụng
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-[#123552] sm:text-4xl">
                Tạo tài khoản để quản lý kế hoạch học tập.
              </h2>
            </div>
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#4f8edc] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Đăng ký
            </Link>
          </div>
        </section>
      </main>
    </LandingLayout>
  );
}

export default Features;
