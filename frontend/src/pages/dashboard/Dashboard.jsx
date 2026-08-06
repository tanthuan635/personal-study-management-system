import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getStatisticsOverview } from "../../api/statisticsApi";
import { getSessionUser } from "../../lib/auth";

function getRequestErrorMessage(error) {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || "Không thể tải dữ liệu tổng quan.";
}

const quickActions = [
  {
    to: "/subjects",
    code: "MH",
    title: "Thêm môn học",
    description: "Cập nhật danh sách môn đang học",
    tone: "bg-blue-50 text-blue-600",
  },
  {
    to: "/tasks",
    code: "DL",
    title: "Tạo deadline",
    description: "Ghi lại công việc cần hoàn thành",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    to: "/schedule",
    code: "LH",
    title: "Xếp lịch học",
    description: "Sắp xếp thời khóa biểu trong tuần",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    to: "/documents",
    code: "TL",
    title: "Thêm tài liệu",
    description: "Lưu file và thông tin tài liệu",
    tone: "bg-emerald-50 text-emerald-700",
  },
];

function MetricCard({ label, value, note, code, tone }) {
  return (
    <article className="group rounded-2xl border border-blue-100/80 bg-white p-5 shadow-sm shadow-blue-100/40 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-2xl text-xs font-black tracking-wide ${tone}`}
        >
          {code}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">{note}</p>
    </article>
  );
}

function Dashboard() {
  const currentUser = getSessionUser();
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadStatistics() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getStatisticsOverview();

        if (isActive) {
          setStatistics(response.data.data);
        }
      } catch (requestError) {
        if (isActive) {
          setStatistics(null);
          setError(getRequestErrorMessage(requestError));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadStatistics();

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const displayName =
    currentUser?.fullName || currentUser?.name || currentUser?.email || "bạn";
  const completionRate = Math.min(
    100,
    Math.max(0, Number(statistics?.completionRate) || 0),
  );

  const overviewCards = statistics
    ? [
        {
          label: "Môn học",
          value: statistics.totalSubjects,
          note: "Tổng môn đang quản lý",
          code: "MH",
          tone: "bg-blue-50 text-blue-600",
        },
        {
          label: "Deadline",
          value: statistics.totalTasks,
          note: "Tổng công việc đã tạo",
          code: "DL",
          tone: "bg-sky-50 text-sky-700",
        },
        {
          label: "Đã hoàn thành",
          value: statistics.completedTasks,
          note: "Deadline đã xử lý xong",
          code: "HT",
          tone: "bg-emerald-50 text-emerald-700",
        },
        {
          label: "Chưa hoàn thành",
          value: statistics.pendingTasks,
          note: "Deadline cần tiếp tục xử lý",
          code: "CL",
          tone: "bg-amber-50 text-amber-700",
        },
      ]
    : [];

  const hasNoData =
    statistics?.totalSubjects === 0 && statistics?.totalTasks === 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_55%,#ffffff_100%)] px-6 py-7 shadow-sm shadow-blue-100/50 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-14 -top-20 size-56 rounded-full border-[28px] border-white/50" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 size-48 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-200/70 bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#4f8edc]">
              Tổng quan học tập
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Chào mừng trở lại, {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Theo dõi tiến độ, xử lý deadline và giữ kế hoạch học tập luôn rõ
              ràng trong một nơi.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/tasks"
                className="inline-flex items-center justify-center rounded-xl bg-[#4f8edc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#4383ce]"
              >
                Xem deadline
              </Link>
              <Link
                to="/subjects"
                className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-white"
              >
                Quản lý môn học
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/65 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Tiến độ hiện tại
                </p>
                {isLoading ? (
                  <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-blue-100" />
                ) : (
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#4f8edc]">
                    {statistics ? `${completionRate}%` : "--"}
                  </p>
                )}
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-lg font-black text-blue-500">
                %
              </span>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#79b8f3] to-[#4f8edc] transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Hoàn thành từng deadline để cải thiện tiến độ.
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <section
          role="alert"
          className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-red-700">Không tải được Dashboard</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((currentKey) => currentKey + 1)}
            className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
          >
            Thử lại
          </button>
        </section>
      ) : null}

      {isLoading ? (
        <section
          aria-label="Đang tải số liệu Dashboard"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-blue-100 bg-white p-5"
            >
              <div className="h-4 w-24 rounded bg-blue-50" />
              <div className="mt-5 h-9 w-16 rounded bg-blue-100" />
              <div className="mt-4 h-4 w-36 rounded bg-slate-100" />
            </div>
          ))}
        </section>
      ) : null}

      {statistics ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => (
              <MetricCard key={card.label} {...card} />
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.35fr_0.8fr_0.8fr]">
            <article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/40 sm:p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div
                  className="grid size-28 shrink-0 place-items-center rounded-full p-2"
                  style={{
                    background: `conic-gradient(#4f8edc ${completionRate}%, #dbeafe 0)`,
                  }}
                >
                  <div className="grid size-full place-items-center rounded-full bg-white">
                    <span className="text-xl font-black text-slate-900">
                      {completionRate}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
                    Tỷ lệ hoàn thành
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                    {statistics.completedTasks}/{statistics.totalTasks} deadline
                    đã hoàn thành
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Còn {statistics.pendingTasks} deadline đang chờ bạn tiếp tục
                    xử lý.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                Quá hạn
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight text-rose-700">
                {statistics.overdueTasks}
              </p>
              <p className="mt-2 text-sm leading-6 text-rose-700/80">
                {statistics.overdueTasks > 0
                  ? "Deadline chưa hoàn thành và đã qua hạn."
                  : "Không có deadline nào bị quá hạn."}
              </p>
            </article>

            <article className="rounded-2xl border border-amber-100 bg-amber-50/80 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                7 ngày tới
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight text-amber-700">
                {statistics.upcomingTasks}
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-700/80">
                {statistics.upcomingTasks > 0
                  ? "Deadline sắp đến hạn cần được ưu tiên."
                  : "Chưa có deadline nào sắp tới."}
              </p>
            </article>
          </section>

          {hasNoData ? (
            <section className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-10 text-center">
              <p className="text-base font-bold text-slate-700">
                Chưa có dữ liệu học tập để tổng hợp
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Hãy thêm môn học và deadline để Dashboard bắt đầu hiển thị tiến
                độ.
              </p>
            </section>
          ) : null}
        </>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
            Truy cập nhanh
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            Bạn muốn làm gì tiếp theo?
          </h2>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/30"
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl text-xs font-black ${action.tone}`}
              >
                {action.code}
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-700">
                  {action.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {action.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
