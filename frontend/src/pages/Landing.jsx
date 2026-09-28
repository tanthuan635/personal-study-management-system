import { useEffect } from "react";
import { Link } from "react-router-dom";

import LandingLayout from "../components/landing/LandingLayout";
import ProductPreview from "../components/landing/ProductPreview";

const featureGroups = [
  {
    number: "01",
    title: "Môn học và deadline",
    description:
      "Lưu thông tin môn học và theo dõi hạn nộp, trạng thái cùng mức ưu tiên của từng công việc.",
  },
  {
    number: "02",
    title: "Lịch học và tài liệu",
    description:
      "Xem các buổi học theo tuần, đồng thời lưu thông tin hoặc file tài liệu theo môn.",
  },
  {
    number: "03",
    title: "Dashboard và thống kê",
    description:
      "Tổng hợp số môn, deadline, tỷ lệ hoàn thành và các deadline quá hạn hoặc sắp tới.",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Tạo không gian học tập",
    description: "Đăng ký tài khoản và thêm các môn bạn đang theo học.",
  },
  {
    number: "02",
    title: "Ghi lại kế hoạch",
    description: "Thêm deadline, lịch học và tài liệu vào đúng môn học.",
  },
  {
    number: "03",
    title: "Theo dõi tiến độ",
    description: "Cập nhật trạng thái công việc và xem số liệu tổng quan.",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M3 10h14M12 5l5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

function Landing() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Study Manager | Quản lý học tập trong một không gian";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <LandingLayout>
      <main>
        <section id="home" className="relative overflow-hidden bg-[#fafdff]">
          <div className="landing-hero-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-16 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:pb-28 lg:pt-24">
            <div className="landing-enter">
              <h1 className="max-w-2xl text-[2.65rem] font-black leading-[1.05] tracking-[-0.055em] text-[#123552] sm:text-6xl lg:text-[4rem]">
                Quản lý việc học hiệu quả hơn trong một không gian duy nhất.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Study Manager giúp bạn quản lý môn học, deadline, lịch học, tài liệu
                và theo dõi tiến độ trong cùng một ứng dụng.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Đăng ký
                  <ArrowIcon />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-black text-[#2f689f] transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Đăng nhập
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 border-t border-blue-100 pt-5 text-xs font-bold text-slate-500">
                {["Môn học", "Deadline", "Lịch tuần", "Tài liệu", "Thống kê"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className="text-blue-500"><CheckIcon /></span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="landing-enter landing-enter-delay pt-3 lg:pt-0">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section aria-labelledby="benefits-title" className="border-y border-blue-100 bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                  Theo dõi việc học
                </p>
                <h2 id="benefits-title" className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#123552] sm:text-4xl">
                  Kế hoạch và tiến độ ở cùng một nơi.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">
                Thông tin môn học làm ngữ cảnh cho deadline, lịch học và tài liệu;
                Dashboard tổng hợp các số liệu từ những mục bạn đã lưu.
              </p>
            </div>

            <div className="mt-12 grid border-y border-blue-100 md:grid-cols-3">
              {[
                ["01", "Theo dõi deadline", "Xem ngày đến hạn, mức ưu tiên và trạng thái của công việc."],
                ["02", "Sắp lịch theo tuần", "Xem các buổi học theo thứ, tiết và môn học."],
                ["03", "Tra lại tài liệu", "Tìm tài liệu theo thông tin đã lưu và môn học liên quan."],
              ].map(([number, title, description], index) => (
                <article key={number} className={`py-7 md:px-7 ${index > 0 ? "border-t border-blue-100 md:border-l md:border-t-0" : ""}`}>
                  <p className="text-xs font-black text-blue-500">{number}</p>
                  <h3 className="mt-4 text-lg font-black tracking-tight text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="feature-groups-title" className="bg-[#f8fbff] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                Nhóm tính năng
              </p>
              <h2 id="feature-groups-title" className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#123552] sm:text-4xl">
                Từ kế hoạch học đến theo dõi tiến độ.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {featureGroups.map((group) => (
                <article key={group.number} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 sm:p-6">
                  <p className="text-xs font-black text-blue-500">{group.number}</p>
                  <h3 className="mt-4 text-lg font-black tracking-tight text-slate-900">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>
                </article>
              ))}
            </div>

            <Link
              to="/features"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-[#3979c2] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Xem chi tiết tính năng
              <ArrowIcon />
            </Link>
          </div>
        </section>

        <section id="workflow" aria-labelledby="workflow-title" className="bg-white py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                  Cách hoạt động
                </p>
                <h2 id="workflow-title" className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#123552] sm:text-5xl">
                  Bắt đầu từ môn học của bạn.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end">
                Tạo tài khoản, nhập kế hoạch học và cập nhật trạng thái khi công
                việc thay đổi.
              </p>
            </div>

            <ol className="relative mt-14 grid gap-0 border-y border-blue-100 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <li key={step.number} className={`relative py-8 lg:px-8 lg:py-10 ${index > 0 ? "border-t border-blue-100 lg:border-l lg:border-t-0" : ""}`}>
                  <span className="grid size-11 place-items-center rounded-xl bg-[#e6f2ff] text-sm font-black text-[#3979c2]">
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-lg font-black text-slate-900">{step.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#eaf4ff]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                Bắt đầu kế hoạch mới
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-[#123552] sm:text-4xl">
                Đưa môn học đầu tiên vào Study Manager.
              </h2>
            </div>
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Tạo tài khoản
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
    </LandingLayout>
  );
}

export default Landing;
