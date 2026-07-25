import { useEffect, useState } from "react";

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

function Dashboard() {
  const currentUser = getSessionUser();
  const [statistics, setStatistics] = useState(null);
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
          setStatistics(response.data.data);
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

  const overviewCards = statistics
    ? [
        {
          label: "Môn học",
          value: statistics.totalSubjects,
          note: "Tổng môn đang quản lý",
          tone: "text-slate-900",
        },
        {
          label: "Deadline",
          value: statistics.totalTasks,
          note: "Tổng deadline đã tạo",
          tone: "text-sky-700",
        },
        {
          label: "Đã hoàn thành",
          value: statistics.completedTasks,
          note: "Deadline đã xử lý xong",
          tone: "text-emerald-700",
        },
        {
          label: "Chưa hoàn thành",
          value: statistics.pendingTasks,
          note: "Deadline cần tiếp tục xử lý",
          tone: "text-amber-700",
        },
        {
          label: "Tỷ lệ hoàn thành",
          value: `${statistics.completionRate}%`,
          note: "Tiến độ deadline hiện tại",
          tone: "text-emerald-700",
        },
        {
          label: "Quá hạn",
          value: statistics.overdueTasks,
          note: "Deadline chưa xong và đã quá hạn",
          tone: "text-rose-700",
        },
        {
          label: "Sắp tới",
          value: statistics.upcomingTasks,
          note: "Deadline trong 7 ngày tới",
          tone: "text-amber-700",
        },
      ]
    : [];

  const hasNoData =
    statistics?.totalSubjects === 0 && statistics?.totalTasks === 0;

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-slate-900 px-6 py-6 text-white shadow-sm">
        <p className="text-sm text-slate-300">Trang tổng quan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Chào mừng trở lại, {currentUser?.fullName || currentUser?.email || "bạn"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Đây là các số liệu học tập mới nhất trong tài khoản của bạn.
        </p>
      </section>

      {isLoading ? (
        <section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-base font-medium text-slate-700">
            Đang tải dữ liệu tổng quan...
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

      {statistics ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => (
              <article
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-500">{card.label}</p>
                <p
                  className={`mt-3 text-3xl font-semibold tracking-tight ${card.tone}`}
                >
                  {card.value}
                </p>
                <p className="mt-2 text-sm text-slate-600">{card.note}</p>
              </article>
            ))}
          </section>

          {hasNoData ? (
            <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <p className="text-base font-medium text-slate-700">
                Chưa có dữ liệu học tập để tổng hợp.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Hãy thêm môn học và deadline để Dashboard bắt đầu hiển thị tiến độ.
              </p>
            </section>
          ) : null}
        </>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Gợi ý nhanh</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Thêm deadline mới trong mục Deadline.</li>
          <li>Cập nhật thời khóa biểu ở mục Lịch học.</li>
          <li>Lưu tài liệu vào mục Tài liệu để dễ tra cứu.</li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
