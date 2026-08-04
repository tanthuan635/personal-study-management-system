import { getTaskDeadlineState } from "../../utils/storage";

function formatDisplayDate(dueDate) {
  const parsedDate = new Date(`${dueDate}T00:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? dueDate : new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

function getPriorityClasses(priority) {
  if (priority === "Cao") return "border-rose-200 bg-rose-50 text-rose-700";
  if (priority === "Trung bình") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getStatusClasses(status) {
  if (status === "Hoàn thành") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Đang làm") return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

function getDeadlineClasses(kind) {
  if (kind === "overdue") return "border-rose-200 bg-rose-50 text-rose-700";
  if (kind === "warning") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-blue-100 bg-blue-50 text-blue-700";
}

function getAccentClass(task, deadlineState) {
  if (task.status === "Hoàn thành") return "from-emerald-400 to-emerald-500";
  if (deadlineState?.kind === "overdue") return "from-rose-400 to-rose-500";
  if (deadlineState?.kind === "warning") return "from-amber-300 to-amber-500";
  return "from-[#79b8f3] to-[#4f8edc]";
}

function TaskCard({ task, subject, onEdit, onDelete, onToggleComplete, isDeleting = false, isUpdatingStatus = false }) {
  const deadlineState = getTaskDeadlineState(task);
  const canMarkComplete = task.status !== "Hoàn thành";
  const isBusy = isDeleting || isUpdatingStatus;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100/60">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${getAccentClass(task, deadlineState)}`} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">{subject?.code || "Môn học đã xóa"}</p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{task.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{subject?.name || `Môn #${task.subject || "không xác định"}`}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityClasses(task.priority)}`}>{task.priority}</span>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(task.status)}`}>{task.status}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#f7fbff] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Hạn nộp</p>
          <p className="mt-1.5 text-sm font-bold text-slate-700">{formatDisplayDate(task.dueDate)}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${getDeadlineClasses(deadlineState?.kind)}`}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">Thời gian</p>
          <p className="mt-1.5 text-sm font-bold">{task.status === "Hoàn thành" ? "Đã hoàn thành" : deadlineState?.label || "Đang theo dõi"}</p>
        </div>
      </div>

      <div className="mt-4 flex-1 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Ghi chú</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{task.note || "Chưa có ghi chú cho deadline này."}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {canMarkComplete ? (
          <button type="button" onClick={() => onToggleComplete(task._id)} disabled={isBusy} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60">
            {isUpdatingStatus ? "Đang cập nhật..." : "Hoàn thành"}
          </button>
        ) : null}
        <button type="button" onClick={() => onEdit(task)} disabled={isBusy} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-bold text-[#3979c2] transition hover:bg-blue-100 disabled:opacity-60">Sửa</button>
        <button type="button" onClick={() => onDelete(task._id)} disabled={isBusy} className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60">{isDeleting ? "Đang xóa..." : "Xóa"}</button>
      </div>
    </article>
  );
}

export default TaskCard;
