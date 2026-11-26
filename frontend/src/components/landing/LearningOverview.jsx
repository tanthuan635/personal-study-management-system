import { Link } from "react-router-dom";

const benefits = [
  {
    title: "Theo dõi deadline",
    description: "Nắm hạn nộp, mức ưu tiên và trạng thái của từng công việc.",
    tone: "bg-amber-50 text-amber-700",
    icon: <path d="M9 5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7M3 4l2 2 4-4M9 11h8M9 16h8" />,
  },
  {
    title: "Sắp lịch theo tuần",
    description: "Xem môn học, tiết học và phòng học trong lịch tuần của bạn.",
    tone: "bg-blue-50 text-[#2f689f]",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
  },
  {
    title: "Tra lại tài liệu",
    description: "Tìm tài liệu đã lưu theo tên, loại file hoặc môn học liên quan.",
    tone: "bg-emerald-50 text-emerald-700",
    icon: <path d="M6 2h8l6 6v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM14 2v6h6M8 13h8M8 17h8" />,
  },
];

const previewNavigation = [
  {
    label: "Dashboard",
    active: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
  },
  {
    label: "Môn học",
    icon: <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23.5v-18ZM20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5a3.5 3.5 0 0 1 3.5 3.5v-18Z" />,
  },
  {
    label: "Deadline",
    icon: <path d="M9 5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7M3 4l2 2 4-4M9 11h8M9 16h8" />,
  },
  {
    label: "Lịch học",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
  },
  {
    label: "Tài liệu",
    icon: <path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM14 2v6h6M8 13h8M8 17h8" />,
  },
  {
    label: "Thống kê",
    icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  },
];

const sampleMetrics = [
  { label: "Môn học", value: "6", code: "MH", tone: "bg-blue-50 text-blue-600" },
  { label: "Deadline", value: "12", code: "DL", tone: "bg-sky-50 text-sky-700" },
  { label: "Đã hoàn thành", value: "9", code: "HT", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Chưa hoàn thành", value: "3", code: "CL", tone: "bg-amber-50 text-amber-700" },
];

const previewQuickActions = [
  { title: "Thêm môn học", code: "MH", tone: "bg-blue-50 text-blue-600" },
  { title: "Tạo deadline", code: "DL", tone: "bg-amber-50 text-amber-700" },
  { title: "Xếp lịch học", code: "LH", tone: "bg-sky-50 text-sky-700" },
  { title: "Thêm tài liệu", code: "TL", tone: "bg-emerald-50 text-emerald-700" },
];

export function DashboardMockup() {
  return (
    <figure
      role="img"
      aria-label="Dashboard minh họa với sidebar, lời chào và truy cập nhanh. Có 6 môn học, 12 deadline, 9 đã hoàn thành, 3 chưa hoàn thành; tiến độ 75%, 1 deadline quá hạn và 2 deadline đến hạn trong 7 ngày tới."
      className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
    >
      <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-[#123552]">Giao diện Dashboard</span>
        <span className="rounded-md border border-blue-100 bg-white/80 px-2 py-1 text-[10px] font-semibold text-[#2f689f]">
          Dữ liệu minh họa
        </span>
      </figcaption>

      <div className="grid overflow-hidden rounded-2xl border border-blue-200/80 bg-slate-50 shadow-[0_18px_45px_rgba(44,99,155,0.12)] sm:grid-cols-[128px_minmax(0,1fr)]">
        <div aria-hidden="true" className="hidden flex-col border-r border-blue-100 bg-[#fafdff] p-2.5 sm:flex">
          <div className="flex items-center gap-1.5 border-b border-blue-100 pb-3 pt-1">
            <img src="/logo.svg" alt="" className="size-6 shrink-0 object-contain" />
            <div>
              <p className="brand-name text-[10px] text-[#183b5b]">Study Manager</p>
              <p className="mt-0.5 text-[8px] text-slate-500">Quản lý học tập</p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {previewNavigation.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-[10px] font-semibold ${item.active ? "bg-[#e6f2ff] text-[#3979c2]" : "text-slate-600"}`}
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-md bg-white/70">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    {item.icon}
                  </svg>
                </span>
                {item.label}
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-blue-100 pt-3">
            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-white p-1.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-blue-50 text-[9px] font-black text-[#4f8edc]">ND</span>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-800">Người dùng</p>
                <p className="mt-0.5 text-[8px] text-slate-500">Tài khoản học tập</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 px-2 py-1.5 text-[10px] font-semibold text-rose-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                <path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5" />
              </svg>
              Đăng xuất
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div aria-hidden="true" className="flex h-7 items-center border-b border-blue-100 bg-[#fafdff] px-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4 text-[#4f8edc] sm:hidden">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </div>

          <div className="space-y-2 p-2.5">
            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_55%,#ffffff_100%)] p-2.5">
              <div aria-hidden="true" className="absolute -right-8 -top-12 size-32 rounded-full border-[16px] border-white/50" />
              <div className="relative grid gap-2 sm:grid-cols-[minmax(0,1fr)_112px] sm:items-center">
                <div>
                  <p className="inline-flex rounded-full border border-blue-200/70 bg-white/60 px-2 py-0.5 text-[9px] font-bold uppercase leading-3 tracking-wide text-[#2f689f]">Tổng quan học tập</p>
                  <p className="mt-1.5 text-sm font-bold tracking-tight text-slate-950">Chào mừng trở lại, bạn</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-600">Theo dõi tiến độ và deadline học tập.</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[9px] font-bold leading-3">
                    <span className="rounded-md bg-[#4f8edc] px-2 py-1.5 text-white">Xem deadline</span>
                    <span className="rounded-md border border-blue-200 bg-white/70 px-2 py-1.5 text-slate-700">Quản lý môn học</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/80 bg-white/65 p-2.5 shadow-sm">
                  <p className="text-[9px] font-bold uppercase leading-3 tracking-wide text-slate-600">Tiến độ hiện tại</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-2xl font-bold tracking-tight text-[#3979c2]">75%</p>
                    <span className="grid size-6 place-items-center rounded-lg bg-blue-50 text-xs font-black text-[#4f8edc]">%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#79b8f3] to-[#4f8edc]" />
                  </div>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {sampleMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-blue-100/80 bg-white p-2 shadow-sm shadow-blue-100/40">
                  <dt className="min-h-7 text-[10px] font-medium leading-3.5 text-slate-600">{metric.label}</dt>
                  <dd className="mt-1 flex items-center justify-between gap-1 text-xl font-bold tracking-tight text-slate-900">
                    <span>{metric.value}</span>
                    <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-md text-[8px] font-black ${metric.tone}`}>{metric.code}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1.4fr_0.8fr_0.8fr]">
              <div className="col-span-2 flex items-center gap-2 rounded-xl border border-blue-100 bg-white p-2.5 sm:col-span-1">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[conic-gradient(#4f8edc_75%,#dbeafe_0)] p-1">
                  <span className="grid size-full place-items-center rounded-full bg-white text-xs font-black text-slate-900">75%</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase leading-3 tracking-wide text-[#2f689f]">Tỷ lệ hoàn thành</p>
                  <p className="mt-1 text-[10px] font-bold leading-4 text-slate-900">9/12 đã hoàn thành</p>
                </div>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-2.5">
                <p className="text-[9px] font-bold uppercase leading-3 tracking-wide text-rose-700">Quá hạn</p>
                <p className="mt-1 text-xl font-black text-rose-700">1</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-2.5">
                <p className="text-[9px] font-bold uppercase leading-3 tracking-wide text-amber-700">7 ngày tới</p>
                <p className="mt-1 text-xl font-black text-amber-700">2</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
              <p className="text-[9px] font-bold uppercase leading-3 tracking-wide text-[#2f689f]">Truy cập nhanh</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {previewQuickActions.map((action) => (
                  <div key={action.code} className="flex items-center gap-1.5 rounded-lg border border-slate-200 p-1.5">
                    <span className={`grid size-5 shrink-0 place-items-center rounded-md text-[8px] font-black ${action.tone}`}>{action.code}</span>
                    <span className="text-[9px] font-bold leading-3 text-slate-800">{action.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function LearningOverview() {
  return (
    <section aria-labelledby="benefits-title" className="flex items-center border-y border-blue-100 bg-[#edf5ff] lg:min-h-[calc(100dvh-var(--landing-header-height))]">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-x-8 lg:gap-y-5 lg:py-6">
        <div className="lg:self-end">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2f689f]">Theo dõi việc học</p>
          <h2 id="benefits-title" className="mt-3 max-w-md text-3xl font-black leading-[1.15] tracking-[-0.04em] text-[#123552] sm:text-4xl">
            Kế hoạch và tiến độ,
            <span className="mt-1 block text-[#3979c2]">ở cùng một nơi.</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Theo dõi deadline, sắp lịch học và nắm tiến độ mỗi ngày.
          </p>
          <Link
            to="/features"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-[#2f689f] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#123552] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#edf5ff]"
          >
            Khám phá tính năng
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
              <path d="M3 10h14M12 5l5 5-5 5" />
            </svg>
          </Link>
        </div>

        <DashboardMockup />

        <div className="grid gap-2.5 md:grid-cols-3 lg:grid-cols-1 lg:self-start">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="flex items-start gap-3 rounded-xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-100/30">
              <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${benefit.tone}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                  {benefit.icon}
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-black leading-5 tracking-tight text-[#123552]">{benefit.title}</h3>
                <p className="mt-0.5 text-xs leading-5 text-slate-600">{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LearningOverview;
