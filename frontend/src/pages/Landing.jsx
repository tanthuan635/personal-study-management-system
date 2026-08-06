import { useEffect } from "react";
import { Link } from "react-router-dom";

import LandingFooter from "../components/landing/LandingFooter";
import LandingHeader from "../components/landing/LandingHeader";
import ProductPreview from "../components/landing/ProductPreview";

const featureGroups = [
  {
    number: "01",
    eyebrow: "Lập kế hoạch",
    title: "Biết rõ môn nào đang học và việc nào cần làm trước.",
    description:
      "Tổ chức thông tin môn học, giảng viên và số tín chỉ; sau đó gắn deadline vào đúng môn để danh sách công việc luôn có ngữ cảnh.",
    features: ["Quản lý môn học", "Deadline theo trạng thái và ưu tiên"],
    visual: "plan",
  },
  {
    number: "02",
    eyebrow: "Sắp xếp tuần học",
    title: "Đặt lịch và tài liệu đúng chỗ để tra cứu nhanh.",
    description:
      "Xem lịch học theo tuần, theo tiết và lưu tài liệu theo từng môn. Bạn không cần tìm lại thông tin ở nhiều ứng dụng khác nhau.",
    features: ["Lịch học dạng tuần", "Tài liệu theo môn học"],
    visual: "organize",
  },
  {
    number: "03",
    eyebrow: "Theo dõi tiến độ",
    title: "Nhìn thấy tiến độ thay vì chỉ ghi lại danh sách.",
    description:
      "Dashboard và trang thống kê tổng hợp công việc đã hoàn thành, chưa hoàn thành, quá hạn và sắp tới để bạn điều chỉnh kế hoạch.",
    features: ["Dashboard tổng quan", "Thống kê tiến độ thực tế"],
    visual: "progress",
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
    title: "Theo dõi mỗi tuần",
    description: "Cập nhật trạng thái công việc và xem tiến độ trên Dashboard.",
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

function FeatureVisual({ type }) {
  if (type === "plan") {
    return (
      <div className="landing-feature-visual bg-[#f7fbff] p-4 sm:p-6" aria-hidden="true">
        <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-blue-100 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-500">
              Môn học
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">
                WE
              </span>
              <div>
                <p className="text-xs font-black text-slate-800">Lập trình Web</p>
                <p className="mt-1 text-[10px] text-slate-400">WEB101 · 3 tín chỉ</p>
              </div>
            </div>
            <div className="mt-4 h-px bg-blue-50" />
            <p className="mt-3 text-[10px] leading-4 text-slate-400">
              Thông tin môn học được dùng xuyên suốt deadline, lịch và tài liệu.
            </p>
          </div>
          <div className="border border-blue-100 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Deadline
              </p>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-black text-amber-600">
                Cao
              </span>
            </div>
            <p className="mt-4 text-sm font-black text-slate-800">Hoàn thiện component React</p>
            <p className="mt-1 text-[10px] text-slate-400">Thuộc môn Lập trình Web</p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[9px] font-bold text-blue-600">
                Đang làm
              </span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[9px] font-bold text-slate-400">
                Có ghi chú
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "organize") {
    return (
      <div className="landing-feature-visual bg-[#f7fbff] p-4 sm:p-6" aria-hidden="true">
        <div className="border border-blue-100 bg-white p-4">
          <div className="grid grid-cols-5 border-b border-blue-50 pb-2 text-center text-[9px] font-black text-slate-400">
            <span>Thứ 2</span>
            <span>Thứ 3</span>
            <span>Thứ 4</span>
            <span>Thứ 5</span>
            <span>Thứ 6</span>
          </div>
          <div className="relative mt-3 grid h-28 grid-cols-5 gap-2 bg-[linear-gradient(to_bottom,transparent_31%,#eff6ff_32%,transparent_33%,transparent_65%,#eff6ff_66%,transparent_67%)]">
            <div className="col-start-1 row-start-1 mt-1 h-12 border-l-2 border-blue-400 bg-blue-50 p-2 text-[8px] font-bold text-blue-700">
              WEB101
            </div>
            <div className="col-start-3 mt-12 h-14 border-l-2 border-amber-400 bg-amber-50 p-2 text-[8px] font-bold text-amber-700">
              DBI202
            </div>
            <div className="col-start-5 mt-5 h-16 border-l-2 border-sky-400 bg-sky-50 p-2 text-[8px] font-bold text-sky-700">
              SWE102
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {["slide-react.pdf", "de-cuong-mon-hoc.docx"].map((fileName, index) => (
            <div key={fileName} className="flex items-center gap-3 border border-blue-100 bg-white p-3">
              <span className={`grid size-8 place-items-center rounded-lg text-[9px] font-black ${index ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"}`}>
                {index ? "DOC" : "PDF"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-slate-700">{fileName}</p>
                <p className="mt-0.5 text-[9px] text-slate-400">Lập trình Web</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="landing-feature-visual bg-[#f7fbff] p-4 sm:p-6" aria-hidden="true">
      <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
        <div className="grid place-items-center border border-blue-100 bg-white p-5 text-center">
          <div className="grid size-28 place-items-center rounded-full bg-[conic-gradient(#4f8edc_0_68%,#dbeafe_68%_100%)] p-2.5">
            <div className="grid size-full place-items-center rounded-full bg-white">
              <div>
                <p className="text-2xl font-black text-slate-900">68%</p>
                <p className="mt-1 text-[9px] font-bold text-slate-400">Hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-blue-100 bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-500">
            Tổng quan deadline
          </p>
          <div className="mt-4 space-y-4">
            {[
              ["Đã hoàn thành", "w-4/5", "bg-emerald-400"],
              ["Đang thực hiện", "w-3/5", "bg-blue-400"],
              ["Cần ưu tiên", "w-1/3", "bg-amber-400"],
            ].map(([label, width, color]) => (
              <div key={label}>
                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                  <span>{label}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${width} ${color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
    <div className="landing-shell min-h-screen overflow-x-hidden bg-white text-slate-900">
      <LandingHeader />

      <main>
        <section id="home" className="relative overflow-hidden bg-[#fafdff]">
          <div className="landing-hero-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-16 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:pb-28 lg:pt-24">
            <div className="landing-enter">
              <p className="inline-flex items-center gap-2 border border-blue-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#3979c2] shadow-sm">
                <span className="size-2 rounded-full bg-[#4f8edc]" />
                Không gian học tập cá nhân
              </p>
              <h1 className="mt-7 max-w-2xl text-[2.65rem] font-black leading-[1.05] tracking-[-0.055em] text-[#123552] sm:text-6xl lg:text-[4rem]">
                Quản lý việc học hiệu quả hơn trong một không gian duy nhất.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Gom môn học, deadline, lịch học, tài liệu và tiến độ về cùng một
                nơi để mỗi ngày bạn đều biết việc nào cần ưu tiên tiếp theo.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Bắt đầu quản lý việc học
                  <ArrowIcon />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-black text-[#2f689f] transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Tôi đã có tài khoản
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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Vì sao cần Study Manager?</p>
                <h2 id="benefits-title" className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#123552] sm:text-4xl">
                  Một tuần học, nhìn rõ trong một màn hình.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">
                Thay vì ghi deadline ở một nơi, lịch học ở nơi khác và tài liệu
                trong nhiều thư mục rời rạc, hệ thống nối chúng lại theo từng môn học.
              </p>
            </div>

            <div className="mt-12 grid border-y border-blue-100 md:grid-cols-3">
              {[
                ["01", "Không bỏ sót deadline", "Theo dõi hạn nộp, mức ưu tiên và trạng thái xử lý."],
                ["02", "Lịch tuần dễ quan sát", "Sắp lớp học theo thứ và tiết ngay trên lịch tuần."],
                ["03", "Tài liệu có ngữ cảnh", "Lưu file đúng môn để mở lại nhanh khi cần học."],
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

        <section id="features" aria-labelledby="features-title" className="bg-[#f8fbff] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Tính năng cốt lõi</p>
              <h2 id="features-title" className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#123552] sm:text-5xl">
                Đi từ kế hoạch đến tiến độ, không đứt đoạn.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Mỗi chức năng giải quyết một phần cụ thể trong quy trình học tập
                và cùng dùng dữ liệu của chính tài khoản bạn.
              </p>
            </div>

            <div className="mt-14 border-t border-blue-100">
              {featureGroups.map((group) => (
                <article key={group.number} className="grid gap-8 border-b border-blue-100 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14 lg:py-16">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-blue-500">{group.number}</span>
                      <span className="h-px w-10 bg-blue-200" />
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{group.eyebrow}</p>
                    </div>
                    <h3 className="mt-6 text-2xl font-black leading-tight tracking-[-0.035em] text-slate-900 sm:text-3xl">{group.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{group.description}</p>
                    <ul className="mt-6 space-y-3">
                      {group.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <span className="grid size-6 place-items-center rounded-lg bg-blue-50 text-blue-500"><CheckIcon /></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <FeatureVisual type={group.visual} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" aria-labelledby="workflow-title" className="bg-white py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Cách hoạt động</p>
                <h2 id="workflow-title" className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#123552] sm:text-5xl">
                  Bắt đầu từ môn học của bạn.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end">
                Không cần cấu hình phức tạp. Tạo tài khoản, nhập kế hoạch học và
                cập nhật tiến độ khi công việc thay đổi.
              </p>
            </div>

            <ol className="relative mt-14 grid gap-0 border-y border-blue-100 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <li key={step.number} className={`relative py-8 lg:px-8 lg:py-10 ${index > 0 ? "border-t border-blue-100 lg:border-l lg:border-t-0" : ""}`}>
                  <span className="grid size-11 place-items-center rounded-xl bg-[#e6f2ff] text-sm font-black text-[#3979c2]">{step.number}</span>
                  <h3 className="mt-6 text-lg font-black text-slate-900">{step.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title" className="bg-[#123552] text-white">
          <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Về sản phẩm</p>
              <h2 id="about-title" className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.045em] sm:text-5xl">
                Được xây cho nhịp học thật của sinh viên.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100/80">
                Study Manager là đồ án quản lý học tập cá nhân. Hệ thống tập trung
                vào những thao tác sinh viên dùng thường xuyên, từ ghi deadline
                đến mở lại tài liệu và xem tiến độ.
              </p>
            </div>
            <div className="border-l border-blue-300/25 pl-6 sm:pl-8">
              {[
                "Dữ liệu tách riêng theo từng tài khoản",
                "Giao diện nhất quán trên các trang quản lý",
                "Không thêm tính năng ngoài quy trình học tập",
              ].map((item) => (
                <div key={item} className="flex gap-3 border-b border-blue-300/20 py-5 first:pt-0 last:border-b-0 last:pb-0">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 text-blue-200"><CheckIcon /></span>
                  <p className="text-sm font-bold leading-7 text-blue-50">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eaf4ff]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Bắt đầu kế hoạch mới</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-[#123552] sm:text-4xl">
                Giữ việc học rõ ràng ngay từ tuần này.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Tạo tài khoản và đưa môn học đầu tiên vào Study Manager.</p>
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

      <LandingFooter />
    </div>
  );
}

export default Landing;
