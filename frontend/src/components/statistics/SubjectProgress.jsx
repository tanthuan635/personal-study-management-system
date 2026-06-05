function SubjectProgress({ progressList }) {
  if (progressList.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-base font-medium text-slate-700">
          Chưa có môn học nào để thống kê.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Thêm môn học và deadline để xem tiến độ theo từng môn.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Tiến độ theo môn
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          Deadline của từng môn học
        </h2>
      </div>

      <div className="space-y-4">
        {progressList.map((item) => (
          <article
            key={item.subject.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-semibold tracking-tight text-slate-900">
                  {item.subject.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {item.subject.code} - {item.totalTasks} deadline
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                  Xong {item.completedTasks}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
                  Chưa xong {item.pendingTasks}
                </span>
                <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
                  {item.completionRate}%
                </span>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{ width: `${item.completionRate}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SubjectProgress;
