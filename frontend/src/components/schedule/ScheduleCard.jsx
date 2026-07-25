import {
  getSchedulePeriodLabel,
  getScheduleTimeRange,
} from "../../utils/storage";

function ScheduleCard({
  schedule,
  subject,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {getSchedulePeriodLabel(schedule)}
          </p>
          <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-900">
            {subject?.name || "Môn học đã bị xóa"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {subject?.code || `Môn #${schedule.subject || "không xác định"}`}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {schedule.room}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        <p className="font-medium text-slate-900">
          {getScheduleTimeRange(schedule)}
        </p>
        {schedule.note ? <p className="mt-1">{schedule.note}</p> : null}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onEdit(schedule)}
          disabled={isDeleting}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(schedule._id)}
          disabled={isDeleting}
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </article>
  );
}

export default ScheduleCard;
