function formatDisplayDate(dateValue) {
  const parsedDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

function getDeadlineLabel(daysUntilDue) {
  if (daysUntilDue < 0) {
    return `Quá hạn ${Math.abs(daysUntilDue)} ngày`;
  }

  if (daysUntilDue === 0) {
    return "Hết hạn hôm nay";
  }

  return `Còn ${daysUntilDue} ngày`;
}

function ProgressSummary({ summary, subjects }) {
  const topSubject = summary.topSubject;
  const nearestDeadline = summary.nearestDeadline;
  const nearestSubject = nearestDeadline
    ? subjects.find(
        (subject) =>
          Number(subject.id) === Number(nearestDeadline.task.subjectId),
      )
    : null;

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
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

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Môn nhiều deadline nhất
        </p>
        {topSubject && topSubject.totalTasks > 0 ? (
          <div className="mt-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {topSubject.subject.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {topSubject.subject.code} · {topSubject.totalTasks} deadline
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Hoàn thành {topSubject.completedTasks}, chưa hoàn thành{" "}
              {topSubject.pendingTasks}.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Chưa có deadline nào để thống kê theo môn.
          </p>
        )}
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Deadline gần nhất
        </p>
        {nearestDeadline ? (
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {nearestDeadline.task.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {nearestSubject?.name || "Môn học đã bị xóa"} ·{" "}
                {formatDisplayDate(nearestDeadline.task.dueDate)}
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              {getDeadlineLabel(nearestDeadline.daysUntilDue)}
            </span>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Không còn deadline chưa hoàn thành.
          </p>
        )}
      </article>
    </section>
  );
}

export default ProgressSummary;
