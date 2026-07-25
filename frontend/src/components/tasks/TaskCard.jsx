import { getTaskDeadlineState } from "../../utils/storage";

function formatDisplayDate(dueDate) {
  const parsedDate = new Date(`${dueDate}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return dueDate;
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

function getPriorityClasses(priority) {
  switch (priority) {
    case "Cao":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Trung bình":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

function getStatusClasses(status) {
  switch (status) {
    case "Hoàn thành":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Đang làm":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getDeadlineClasses(kind) {
  switch (kind) {
    case "overdue":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function TaskCard({
  task,
  subject,
  onEdit,
  onDelete,
  onToggleComplete,
  isDeleting = false,
  isUpdatingStatus = false,
}) {
  const deadlineState = getTaskDeadlineState(task);
  const canMarkComplete = task.status !== "Hoàn thành";
  const isBusy = isDeleting || isUpdatingStatus;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {subject?.code || `Môn #${task.subject || "không xác định"}`}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
            {task.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Môn học: {subject?.name || "Môn học đã bị xóa"}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <span
            className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium ${getPriorityClasses(task.priority)}`}
          >
            {task.priority}
          </span>
          <span
            className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(task.status)}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {deadlineState?.kind === "overdue" || deadlineState?.kind === "warning" ? (
        <div
          className={`mt-4 rounded-xl border px-3 py-2 text-sm font-medium ${getDeadlineClasses(deadlineState.kind)}`}
        >
          {deadlineState.label}
        </div>
      ) : null}

      <dl className="mt-4 space-y-3 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Hạn nộp</dt>
          <dd>{formatDisplayDate(task.dueDate)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Mô tả môn học</dt>
          <dd>{subject?.description || "Không có mô tả"}</dd>
        </div>
      </dl>

      {task.note ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {task.note}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        {canMarkComplete ? (
          <button
            type="button"
            onClick={() => onToggleComplete(task._id)}
            disabled={isBusy}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingStatus ? "Đang cập nhật..." : "Hoàn thành"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onEdit(task)}
          disabled={isBusy}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          disabled={isBusy}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
