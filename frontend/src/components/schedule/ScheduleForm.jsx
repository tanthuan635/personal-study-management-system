import { useMemo, useState } from "react";

import {
  getPeriodTimeRange,
  SCHEDULE_DAY_OPTIONS,
  SCHEDULE_PERIOD_OPTIONS,
} from "../../utils/storage";

function getDefaultSubjectId(subjects) {
  return subjects.length > 0 ? String(subjects[0]._id) : "";
}

function getFormValue(initialSchedule, subjects) {
  if (!initialSchedule) {
    return {
      subject: getDefaultSubjectId(subjects),
      dayOfWeek: SCHEDULE_DAY_OPTIONS[0],
      startPeriod: "1",
      endPeriod: "1",
      room: "",
      note: "",
    };
  }

  return {
    subject: String(initialSchedule.subject ?? getDefaultSubjectId(subjects)),
    dayOfWeek: initialSchedule.dayOfWeek || SCHEDULE_DAY_OPTIONS[0],
    startPeriod: String(initialSchedule.startPeriod || 1),
    endPeriod: String(
      initialSchedule.endPeriod || initialSchedule.startPeriod || 1,
    ),
    room: initialSchedule.room || "",
    note: initialSchedule.note || "",
  };
}

const inputClassName =
  "w-full rounded-2xl border border-blue-100 bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100";

function ScheduleForm({
  mode = "add",
  initialSchedule,
  subjects,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    getFormValue(initialSchedule, subjects),
  );
  const isEditing = mode === "edit";

  const selectedSubjectExists = useMemo(() => {
    return subjects.some((subject) => String(subject._id) === formData.subject);
  }, [formData.subject, subjects]);

  const availableEndPeriods = useMemo(() => {
    const startPeriod = Number(formData.startPeriod) || 1;

    return SCHEDULE_PERIOD_OPTIONS.filter((period) => period >= startPeriod);
  }, [formData.startPeriod]);

  const hasValidPeriodRange =
    Number(formData.endPeriod) >= Number(formData.startPeriod);

  const isFormValid = Boolean(
    formData.subject &&
      selectedSubjectExists &&
      formData.dayOfWeek &&
      formData.startPeriod &&
      formData.endPeriod &&
      hasValidPeriodRange &&
      formData.room.trim(),
  );

  const timePreview = getPeriodTimeRange(
    formData.startPeriod,
    formData.endPeriod,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      if (name === "startPeriod") {
        const nextStartPeriod = Number(value);
        const currentEndPeriod = Number(current.endPeriod);

        return {
          ...current,
          startPeriod: value,
          endPeriod:
            currentEndPeriod < nextStartPeriod ? value : current.endPeriod,
        };
      }

      return {
        ...current,
        [name]: value,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    onSubmit({
      subject: formData.subject,
      dayOfWeek: formData.dayOfWeek,
      startPeriod: Number(formData.startPeriod),
      endPeriod: Number(formData.endPeriod),
      room: formData.room.trim(),
      note: formData.note.trim(),
    });
  };

  return (
    <section className="rounded-[2rem] border border-blue-100 bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#4f8edc]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
              <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
              <path d="M8 13h3M14 13h2M8 17h3M14 17h2" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
              {isEditing ? "Chỉnh sửa lịch học" : "Lịch học mới"}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {isEditing ? "Cập nhật buổi học" : "Thêm buổi học vào tuần"}
            </h2>
          </div>
        </div>
        <button
          type="button"
          aria-label="Đóng form"
          onClick={onCancel}
          disabled={isSubmitting}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {subjects.length === 0 && !isEditing ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Cần có ít nhất một môn học trước khi thêm lịch học mới.
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block" htmlFor="schedule-subject">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Môn học</span>
            <select
              id="schedule-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className={inputClassName}
            >
              <option value="">Chọn môn học</option>
              {!selectedSubjectExists && formData.subject ? (
                <option value={formData.subject}>
                  Môn đã bị xóa (#{formData.subject})
                </option>
              ) : null}
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block" htmlFor="schedule-day">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Thứ trong tuần</span>
            <select
              id="schedule-day"
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClassName}
            >
              {SCHEDULE_DAY_OPTIONS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block" htmlFor="schedule-start-period">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Tiết bắt đầu</span>
            <select
              id="schedule-start-period"
              name="startPeriod"
              value={formData.startPeriod}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClassName}
            >
              {SCHEDULE_PERIOD_OPTIONS.map((period) => (
                <option key={period} value={period}>
                  Tiết {period}
                </option>
              ))}
            </select>
          </label>

          <label className="block" htmlFor="schedule-end-period">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Tiết kết thúc</span>
            <select
              id="schedule-end-period"
              name="endPeriod"
              value={formData.endPeriod}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClassName}
            >
              {availableEndPeriods.map((period) => (
                <option key={period} value={period}>
                  Tiết {period}
                </option>
              ))}
            </select>
          </label>

          <label className="block" htmlFor="schedule-room">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Phòng học</span>
            <input
              id="schedule-room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="A101"
              className={inputClassName}
            />
          </label>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#4f8edc] shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-400">Thời gian dự kiến</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{timePreview}</p>
          </div>
        </div>

        <label className="block" htmlFor="schedule-note">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Ghi chú</span>
          <textarea
            id="schedule-note"
            name="note"
            rows="3"
            value={formData.note}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Học lý thuyết, chuẩn bị bài trước..."
            className={`${inputClassName} resize-y`}
          />
        </label>

        {!hasValidPeriodRange ? (
          <p className="text-sm font-semibold text-rose-600">
            Tiết kết thúc phải sau hoặc bằng tiết bắt đầu.
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Đang lưu...
              </>
            ) : isEditing ? "Lưu thay đổi" : "Thêm lịch học"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ScheduleForm;
