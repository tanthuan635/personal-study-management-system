import { useEffect, useState } from "react";

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
  }, []);

  const hasNoData = summary?.totalSubjects === 0 && summary?.totalTasks === 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Thống kê học tập
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Tổng quan tiến độ
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Theo dõi môn học, deadline và tỷ lệ hoàn thành từ dữ liệu tài khoản.
        </p>
      </section>

      {isLoading ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-base font-medium text-slate-700">
            Đang tải dữ liệu thống kê...
          </p>
        </section>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {summary ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Tổng môn học" value={summary.totalSubjects} />
            <StatCard label="Tổng deadline" value={summary.totalTasks} tone="sky" />
            <StatCard
              label="Đã hoàn thành"
              value={summary.completedTasks}
              tone="emerald"
            />
            <StatCard
              label="Chưa hoàn thành"
              value={summary.pendingTasks}
              tone="amber"
            />
            <StatCard
              label="Tỷ lệ hoàn thành"
              value={`${summary.completionRate}%`}
              helper={`${summary.completedTasks}/${summary.totalTasks} deadline`}
              tone="emerald"
            />
            <StatCard
              label="Đã quá hạn"
              value={summary.overdueTasks}
              tone="rose"
            />
            <StatCard
              label="Trong 7 ngày tới"
              value={summary.upcomingTasks}
              tone="amber"
            />
          </section>

          {hasNoData ? (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-base font-medium text-slate-700">
                Chưa có dữ liệu học tập để thống kê.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Hãy thêm môn học và deadline để xem tiến độ hoàn thành.
              </p>
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
