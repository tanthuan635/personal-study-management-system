function getProgressMessage(completionRate) {
  if (completionRate >= 100) {
    return "Tất cả deadline đã được hoàn thành.";
  }

  if (completionRate >= 70) {
    return "Tiến độ đang tốt, hãy hoàn thành các deadline còn lại.";
  }

  if (completionRate >= 40) {
    return "Tiến độ đang ở mức trung bình và vẫn cần được cải thiện.";
  }

  return "Hãy ưu tiên các deadline quan trọng để cải thiện tiến độ.";
}

function ProgressSummary({ summary }) {
  const completionRate = Math.min(
    100,
    Math.max(0, Number(summary.completionRate) || 0),
  );
  const pendingRate = summary.totalTasks > 0 ? 100 - completionRate : 0;

  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 sm:p-7">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div
              className="grid size-40 shrink-0 place-items-center rounded-full p-3"
              style={{
                background: `conic-gradient(#4f8edc ${completionRate}%, #dbeafe 0)`,
              }}
            >
              <div className="grid size-full place-items-center rounded-full bg-white shadow-inner">
                <div className="text-center">
                  <p className="text-3xl font-black tracking-tight text-slate-900">{completionRate}%</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Hoàn thành</p>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Tiến độ tổng thể</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {summary.completedTasks}/{summary.totalTasks} deadline đã hoàn thành
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{getProgressMessage(completionRate)}</p>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#79b8f3] to-[#4f8edc] transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-4 text-xs font-semibold text-slate-400">
                <span>0%</span>
                <span>Mục tiêu 100%</span>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Phân bổ trạng thái</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">Deadline đã xử lý và còn lại</h2>

          <div className="mt-6 overflow-hidden rounded-full bg-slate-100">
            <div className="flex h-4 w-full">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${pendingRate}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">{completionRate}%</span>
              </div>
              <p className="mt-3 text-2xl font-black text-emerald-700">{summary.completedTasks}</p>
              <p className="mt-1 text-sm font-medium text-emerald-700/80">Đã hoàn thành</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="text-xs font-bold text-amber-700">{pendingRate}%</span>
              </div>
              <p className="mt-3 text-2xl font-black text-amber-700">{summary.pendingTasks}</p>
              <p className="mt-1 text-sm font-medium text-amber-700/80">Chưa hoàn thành</p>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="relative overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/70 p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full border-[18px] border-white/40" />
          <div className="relative flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">Deadline quá hạn</p>
              <p className="mt-3 text-4xl font-black tracking-tight text-rose-700">{summary.overdueTasks}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-rose-700/80">
                {summary.overdueTasks > 0
                  ? "Các deadline này chưa hoàn thành và đã qua ngày hết hạn."
                  : "Không có deadline nào đang bị quá hạn."}
              </p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/80 text-rose-600 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                <path d="M12 3 2.5 20h19L12 3Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </span>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/80 p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full border-[18px] border-white/40" />
          <div className="relative flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Trong 7 ngày tới</p>
              <p className="mt-3 text-4xl font-black tracking-tight text-amber-700">{summary.upcomingTasks}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-amber-700/80">
                {summary.upcomingTasks > 0
                  ? "Deadline sắp đến hạn nên được ưu tiên trong kế hoạch học tập."
                  : "Không có deadline nào sắp đến hạn trong 7 ngày tới."}
              </p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/80 text-amber-600 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h6" />
              </svg>
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProgressSummary;
