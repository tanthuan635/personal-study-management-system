import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../../utils/storage";

function TaskFilter({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
  onReset,
}) {
  const hasActiveFilters = Boolean(statusFilter || priorityFilter);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Bộ lọc deadline
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
            Lọc theo trạng thái và ưu tiên
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Giúp bạn tập trung vào deadline cần xử lý ngay.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Trạng thái
            </span>
            <select
              value={statusFilter}
              onChange={(event) => onStatusChange(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">Tất cả trạng thái</option>
              {TASK_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Ưu tiên
            </span>
            <select
              value={priorityFilter}
              onChange={(event) => onPriorityChange(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">Tất cả ưu tiên</option>
              {TASK_PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        >
          Xóa bộ lọc
        </button>
      </div>
    </section>
  );
}

export default TaskFilter;
