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
    <article className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100/60">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#79b8f3] to-[#4f8edc]" />

      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-[0.16em] text-blue-500">
            {subject?.code || "Môn học đã xóa"}
          </p>
          <h4 className="mt-1.5 line-clamp-2 text-base font-bold leading-6 text-slate-900">
            {subject?.name || `Môn #${schedule.subject || "không xác định"}`}
          </h4>
        </div>
        <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#3979c2]">
          {schedule.room}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-[#f7fbff] p-3.5">
        <span className="grid size-10 place-items-center rounded-xl bg-white text-[#4f8edc] shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800">
            {getSchedulePeriodLabel(schedule)}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {getScheduleTimeRange(schedule)}
          </p>
        </div>
      </div>

      <p className="mt-3 min-h-10 pl-1 text-sm leading-5 text-slate-500">
        {schedule.note || "Chưa có ghi chú cho buổi học này."}
      </p>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onEdit(schedule)}
          disabled={isDeleting}
          className="flex-1 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-bold text-[#3979c2] transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(schedule._id)}
          disabled={isDeleting}
          className="flex-1 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </article>
  );
}

export default ScheduleCard;
