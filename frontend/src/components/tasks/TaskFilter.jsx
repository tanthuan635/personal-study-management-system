import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../../utils/storage";

const selectClassName =
  "w-full rounded-2xl border border-blue-100 bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-800 outline-none transition hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70";

function TaskFilter({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
  onReset,
}) {
  const hasActiveFilters = Boolean(statusFilter || priorityFilter);

  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/30 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="mr-auto">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
            Bộ lọc
          </p>
          <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
            Tập trung vào việc cần xử lý
          </h2>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-xl">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Trạng thái</span>
            <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)} className={selectClassName}>
              <option value="">Tất cả trạng thái</option>
              {TASK_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-600">Ưu tiên</span>
            <select value={priorityFilter} onChange={(event) => onPriorityChange(event.target.value)} className={selectClassName}>
              <option value="">Tất cả ưu tiên</option>
              {TASK_PRIORITY_OPTIONS.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </label>
        </div>

        <button type="button" onClick={onReset} disabled={!hasActiveFilters} className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
          Xóa bộ lọc
        </button>
      </div>
    </section>
  );
}

export default TaskFilter;
