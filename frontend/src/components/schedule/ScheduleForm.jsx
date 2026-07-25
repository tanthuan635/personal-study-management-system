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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {isEditing ? "Chỉnh sửa lịch học" : "Thêm lịch học"}
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          {isEditing ? "Cập nhật buổi học" : "Tạo buổi học mới"}
        </h2>
      </div>

      {subjects.length === 0 && !isEditing ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Cần có ít nhất một môn học trước khi thêm lịch học mới.
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label
              htmlFor="schedule-subject"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Môn học
            </label>
            <select
              id="schedule-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
          </div>

          <div>
            <label
              htmlFor="schedule-day"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Thứ trong tuần
            </label>
            <select
              id="schedule-day"
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {SCHEDULE_DAY_OPTIONS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="schedule-start-period"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Tiết bắt đầu
            </label>
            <select
              id="schedule-start-period"
              name="startPeriod"
              value={formData.startPeriod}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {SCHEDULE_PERIOD_OPTIONS.map((period) => (
                <option key={period} value={period}>
                  Tiết {period}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="schedule-end-period"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Tiết kết thúc
            </label>
            <select
              id="schedule-end-period"
              name="endPeriod"
              value={formData.endPeriod}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {availableEndPeriods.map((period) => (
                <option key={period} value={period}>
                  Tiết {period}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="schedule-room"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phòng học
            </label>
            <input
              id="schedule-room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="A101"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Thời gian: <span className="font-semibold text-slate-900">{timePreview}</span>
        </div>

        <div>
          <label
            htmlFor="schedule-note"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Ghi chú
          </label>
          <textarea
            id="schedule-note"
            name="note"
            rows="3"
            value={formData.note}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Học lý thuyết"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {!hasValidPeriodRange ? (
          <p className="text-sm font-medium text-rose-600">
            Tiết kết thúc phải sau hoặc bằng tiết bắt đầu.
          </p>
        ) : null}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-900"
          >
            {isSubmitting
              ? "Đang lưu..."
              : isEditing
                ? "Lưu thay đổi"
                : "Thêm lịch học"}
          </button>

          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditing ? "Hủy" : "Đóng"}
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default ScheduleForm;
