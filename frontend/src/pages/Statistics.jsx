import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getStatisticsOverview } from "../api/statisticsApi";
import ProgressSummary from "../components/statistics/ProgressSummary";
import StatCard from "../components/statistics/StatCard";

function getRequestErrorMessage(error) {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || "Không thể tải dữ liệu thống kê.";
}

function Statistics() {
  const [summary, setSummary] = useState(null);
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
          setSummary(response.data.data);
        }
      } catch (requestError) {
        if (isActive) {
          setSummary(null);
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

  const completionRate = Math.min(
    100,
    Math.max(0, Number(summary?.completionRate) || 0),
  );
  const hasNoData = summary?.totalSubjects === 0 && summary?.totalTasks === 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_58%,#ffffff_100%)] px-6 py-7 shadow-sm shadow-blue-100/50 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border-[26px] border-white/50" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 size-48 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[1fr_270px] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-200/70 bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#4f8edc]">
              Báo cáo học tập
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Thống kê tiến độ
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Theo dõi mức độ hoàn thành, nhận diện deadline cần ưu tiên và đánh giá tiến độ hiện tại.
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Hoàn thành</p>
                {isLoading ? (
                  <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-blue-100" />
                ) : (
                  <p className="mt-2 text-3xl font-black tracking-tight text-[#4f8edc]">
                    {summary ? `${completionRate}%` : "--"}
                  </p>
                )}
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-lg font-black text-blue-500">%</span>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#79b8f3] to-[#4f8edc] transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {summary
                ? `${summary.completedTasks}/${summary.totalTasks} deadline đã hoàn thành`
                : "Dữ liệu sẽ hiển thị sau khi tải xong."}
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <section
          role="alert"
          className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-bold text-rose-700">Không tải được thống kê</p>
            <p className="mt-1 text-sm text-rose-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((currentKey) => currentKey + 1)}
            className="shrink-0 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
          >
            Thử lại
          </button>
        </section>
      ) : null}

      {isLoading ? (
        <>
          <section aria-label="Đang tải số liệu thống kê" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-2xl border border-blue-100 bg-white p-5">
                <div className="h-4 w-24 rounded bg-blue-50" />
                <div className="mt-5 h-9 w-16 rounded bg-blue-100" />
                <div className="mt-4 h-4 w-36 rounded bg-slate-100" />
              </div>
            ))}
          </section>
          <section className="grid gap-4 xl:grid-cols-2">
            <div className="h-72 animate-pulse rounded-2xl border border-blue-100 bg-white" />
            <div className="h-72 animate-pulse rounded-2xl border border-blue-100 bg-white" />
          </section>
        </>
      ) : null}

      {summary ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Tổng môn học"
              value={summary.totalSubjects}
              helper="Môn học đang quản lý"
              code="MH"
              tone="blue"
            />
            <StatCard
              label="Tổng deadline"
              value={summary.totalTasks}
              helper="Công việc đã tạo"
              code="DL"
              tone="sky"
            />
            <StatCard
              label="Đã hoàn thành"
              value={summary.completedTasks}
              helper="Deadline đã xử lý xong"
              code="HT"
              tone="emerald"
            />
            <StatCard
              label="Chưa hoàn thành"
              value={summary.pendingTasks}
              helper="Deadline còn phải xử lý"
              code="CL"
              tone="amber"
            />
          </section>

          {hasNoData ? (
            <section className="rounded-[2rem] border border-dashed border-blue-200 bg-blue-50/40 px-6 py-14 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#4f8edc] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6">
                  <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
                </svg>
              </span>
              <p className="mt-4 text-base font-bold text-slate-700">Chưa có dữ liệu để thống kê</p>
              <p className="mt-2 text-sm text-slate-500">Hãy thêm môn học và deadline để bắt đầu theo dõi tiến độ.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/subjects" className="rounded-xl bg-[#4f8edc] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4383ce]">
                  Thêm môn học
                </Link>
                <Link to="/tasks" className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-[#3979c2] transition hover:bg-blue-50">
                  Tạo deadline
                </Link>
              </div>
            </section>
          ) : (
            <ProgressSummary summary={summary} />
          )}
        </>
      ) : null}
    </div>
  );
}

export default Statistics;
