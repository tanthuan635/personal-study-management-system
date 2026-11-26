import { useEffect } from "react";
import { Link } from "react-router-dom";

import LandingLayout from "../components/landing/LandingLayout";
import LearningOverview from "../components/landing/LearningOverview";
import ProductTourPreview from "../components/landing/ProductTourPreview";

const workflowSteps = [
  {
    title: "Thêm môn học",
    description: "Lưu các môn đang học để quản lý thông tin và sắp xếp kế hoạch theo từng môn.",
    icon: <path d="M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zM12 6v16" />,
  },
  {
    title: "Ghi kế hoạch học tập",
    description: "Thêm nhiệm vụ, đặt deadline và xếp các buổi học vào lịch tuần.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18m-11 5 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Theo dõi trên Dashboard",
    description: "Xem tiến độ hoàn thành và các deadline sắp tới để biết phần việc cần tiếp tục xử lý.",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
  },
];

const productAreas = [
  {
    id: "dashboard",
    title: "Dashboard",
    headline: "Nắm tiến độ trong một lần xem.",
    description: "Xem tổng quan môn học, tiến độ hoàn thành và số deadline cần chú ý trước khi bắt đầu buổi học.",
    linkLabel: "Khám phá Dashboard",
  },
  {
    id: "documents",
    title: "Tài liệu",
    headline: "Tìm lại tài liệu theo đúng môn.",
    description: "Tra cứu bài giảng và tài liệu đã lưu bằng tên, loại file hoặc môn học để tiếp tục việc học.",
    linkLabel: "Khám phá Tài liệu",
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
        <section id="home" className="landing-hero relative overflow-hidden bg-[#fafdff]">
          <div className="landing-hero-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
            <div className="landing-enter mx-auto max-w-4xl text-center">
              <h1 className="text-[2.65rem] font-black leading-[1.05] tracking-[-0.055em] text-[#123552] sm:text-6xl lg:text-[4rem]">
                Quản lý việc học hiệu quả hơn trong một không gian duy nhất.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Study Manager giúp bạn quản lý môn học, deadline, lịch học, tài liệu
                và theo dõi tiến độ trong cùng một ứng dụng.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Đăng ký
                  <ArrowIcon />
                </Link>
                <Link
                  to="/features"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-black text-[#2f689f] transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Khám phá tính năng
                </Link>
              </div>
            </div>
          </div>
        </section>

        <LearningOverview />

        <section aria-labelledby="workflow-title" className="bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2f689f]">Từ kế hoạch đến tiến độ</p>
            <h2 id="workflow-title" className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-[#123552] sm:text-4xl">
              Một quy trình học tập rõ ràng
            </h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-blue-100 bg-[#f7fbff] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-[#e6f2ff] text-[#3979c2]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                        {step.icon}
                      </svg>
                    </span>
                    <span aria-hidden="true" className="text-xs font-bold tracking-widest text-[#2f689f]">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-[#123552]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="product-areas-title" className="border-t border-blue-100 bg-[#fafdff]">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2f689f]">Gần hơn với giao diện</p>
            <h2 id="product-areas-title" className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-[#123552] sm:text-4xl">
              Khám phá các khu vực trong Study Manager
            </h2>
            <div className="mt-10 space-y-12 lg:space-y-16">
              {productAreas.map((area) => (
                <article key={area.id} aria-labelledby={"area-" + area.id + "-title"} className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2f689f]">{area.title}</p>
                    <h3 id={"area-" + area.id + "-title"} className="mt-3 max-w-md text-2xl font-black tracking-[-0.035em] text-[#123552] sm:text-3xl">{area.headline}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">{area.description}</p>
                    <Link to={"/about#" + area.id} className="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-[#2f689f] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                      {area.linkLabel}
                      <ArrowIcon />
                    </Link>
                  </div>
                  <div className="min-w-0">
                    <ProductTourPreview screen={area.id} title={area.title} />
                  </div>
                </article>
              ))}
            </div>
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
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/about"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-[#2f689f] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Chi tiết về web
              </Link>
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Tạo tài khoản
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </LandingLayout>
  );
}

export default Landing;
