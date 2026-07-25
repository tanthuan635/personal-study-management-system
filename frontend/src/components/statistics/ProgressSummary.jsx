function ProgressSummary({ summary }) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Tỷ lệ hoàn thành
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
              {summary.completionRate}% deadline đã xong
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {summary.completedTasks}/{summary.totalTasks}
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${summary.completionRate}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Còn {summary.pendingTasks} deadline chưa hoàn thành.
        </p>
      </article>

      <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
          Deadline quá hạn
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-rose-700">
          {summary.overdueTasks}
        </p>
        <p className="mt-2 text-sm text-rose-700">
          {summary.overdueTasks > 0
            ? "Các deadline này chưa hoàn thành và đã qua ngày hết hạn."
            : "Không có deadline nào đang bị quá hạn."}
        </p>
      </article>

      <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm xl:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
          Deadline sắp tới
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-3xl font-semibold tracking-tight text-amber-700">
            {summary.upcomingTasks}
          </p>
          <p className="text-sm text-amber-700">
            {summary.upcomingTasks > 0
              ? "Deadline chưa hoàn thành trong 7 ngày tới."
              : "Không có deadline nào trong 7 ngày tới."}
          </p>
        </div>
      </article>
    </section>
  );
}

export default ProgressSummary;
