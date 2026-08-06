import { useEffect, useMemo, useState } from "react";

import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
} from "../api/scheduleApi";
import { getSubjects } from "../api/subjectApi";
import ScheduleForm from "../components/schedule/ScheduleForm";
import ScheduleTable from "../components/schedule/ScheduleTable";
import {
  getPeriodTimeRange,
  SCHEDULE_DAY_OPTIONS,
  SCHEDULE_PERIOD_OPTIONS,
} from "../utils/storage";

function getRequestErrorMessage(error, fallbackMessage) {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || fallbackMessage;
}

function getPeriodFromTime(timeValue, boundary, fallbackPeriod) {
  const numericPeriod = Number(timeValue);

  if (
    Number.isInteger(numericPeriod) &&
    SCHEDULE_PERIOD_OPTIONS.includes(numericPeriod)
  ) {
    return numericPeriod;
  }

  const periodBoundaries = SCHEDULE_PERIOD_OPTIONS.map((period) => {
    const [startTime, endTime] = getPeriodTimeRange(period).split(" - ");
    return {
      period,
      time: boundary === "end" ? endTime : startTime,
    };
  });
  const matchedPeriod = periodBoundaries.find(({ time }) => time === timeValue);

  if (matchedPeriod) {
    return matchedPeriod.period;
  }

  const [hours, minutes] = String(timeValue).split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return fallbackPeriod;
  }

  const targetMinutes = hours * 60 + minutes;
  const closestPeriod = periodBoundaries.reduce((closest, current) => {
    const [currentHours, currentMinutes] = current.time.split(":").map(Number);
    const currentDistance = Math.abs(
      currentHours * 60 + currentMinutes - targetMinutes,
    );

    return currentDistance < closest.distance
      ? { period: current.period, distance: currentDistance }
      : closest;
  }, { period: fallbackPeriod, distance: Number.POSITIVE_INFINITY });

  return closestPeriod.period;
}

function normalizeSchedule(schedule) {
  const startPeriod = getPeriodFromTime(schedule.startTime, "start", 1);
  const endPeriod = getPeriodFromTime(schedule.endTime, "end", startPeriod);

  return {
    ...schedule,
    startPeriod,
    endPeriod: Math.max(startPeriod, endPeriod),
  };
}

function buildSchedulePayload(scheduleData) {
  const [startTime] = getPeriodTimeRange(scheduleData.startPeriod).split(" - ");
  const [, endTime] = getPeriodTimeRange(scheduleData.endPeriod).split(" - ");

  return {
    subject: scheduleData.subject,
    dayOfWeek: scheduleData.dayOfWeek,
    startTime,
    endTime,
    room: scheduleData.room,
    note: scheduleData.note,
  };
}

function Toast({ type, children, onClose }) {
  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
        isSuccess
          ? "border-emerald-200 shadow-emerald-900/10"
          : "border-rose-200 shadow-rose-900/10"
      }`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full ${
          isSuccess
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {isSuccess ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
            <path d="m5 12 4 4L19 6" />
          </svg>
        ) : (
          <span className="text-sm font-black">!</span>
        )}
      </span>
      <p className={`min-w-0 flex-1 pt-1 text-sm font-semibold leading-6 ${isSuccess ? "text-emerald-700" : "text-rose-700"}`}>
        {children}
      </p>
      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={onClose}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-4">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingScheduleId, setDeletingScheduleId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadScheduleData() {
      setIsLoading(true);
      setError("");

      try {
        const [scheduleResponse, subjectResponse] = await Promise.all([
          getSchedules(),
          getSubjects(),
        ]);

        if (isActive) {
          setSchedules((scheduleResponse.data.data || []).map(normalizeSchedule));
          setSubjects(subjectResponse.data.data || []);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            getRequestErrorMessage(
              requestError,
              "Không thể tải dữ liệu lịch học.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadScheduleData();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setMessage(""), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const filteredSchedules = useMemo(() => {
    if (!subjectFilter) {
      return schedules;
    }

    return schedules.filter(
      (schedule) => String(schedule.subject) === subjectFilter,
    );
  }, [schedules, subjectFilter]);

  const visibleDayCount = useMemo(() => {
    return new Set(
      filteredSchedules.map((schedule) => schedule.dayOfWeek),
    ).size;
  }, [filteredSchedules]);

  const isFormVisible = activeFormMode !== null;

  const openAddForm = () => {
    if (isSubmitting) {
      return;
    }

    setError("");
    setMessage("");
    setEditingSchedule(null);
    setActiveFormMode("add");
  };

  const closeForm = () => {
    if (isSubmitting) {
      return;
    }

    setEditingSchedule(null);
    setActiveFormMode(null);
  };

  const handleSubmit = async (scheduleData) => {
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = buildSchedulePayload(scheduleData);

      if (activeFormMode === "edit" && editingSchedule) {
        const response = await updateSchedule(editingSchedule._id, payload);
        const updatedSchedule = normalizeSchedule(response.data.data);

        setSchedules((currentSchedules) =>
          currentSchedules.map((schedule) =>
            schedule._id === updatedSchedule._id ? updatedSchedule : schedule,
          ),
        );
        setMessage("Cập nhật lịch học thành công.");
      } else {
        const response = await createSchedule(payload);
        const createdSchedule = normalizeSchedule(response.data.data);

        setSchedules((currentSchedules) => [
          ...currentSchedules,
          createdSchedule,
        ]);
        setMessage("Thêm lịch học thành công.");
      }

      setEditingSchedule(null);
      setActiveFormMode(null);
      return true;
    } catch (requestError) {
      setError(
        getRequestErrorMessage(
          requestError,
          activeFormMode === "edit"
            ? "Không thể cập nhật lịch học."
            : "Không thể thêm lịch học.",
        ),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (schedule) => {
    setError("");
    setMessage("");
    setEditingSchedule(schedule);
    setActiveFormMode("edit");
  };

  const openDeleteDialog = (scheduleId) => {
    const selectedSchedule = schedules.find(
      (schedule) => schedule._id === scheduleId,
    );

    if (!selectedSchedule) {
      return;
    }

    setError("");
    setMessage("");
    setScheduleToDelete(selectedSchedule);
  };

  const closeDeleteDialog = () => {
    if (!deletingScheduleId) {
      setScheduleToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete) {
      return;
    }

    const scheduleId = scheduleToDelete._id;
    setDeletingScheduleId(scheduleId);
    setError("");
    setMessage("");

    try {
      await deleteSchedule(scheduleId);
      setSchedules((currentSchedules) =>
        currentSchedules.filter((schedule) => schedule._id !== scheduleId),
      );

      if (editingSchedule?._id === scheduleId) {
        setEditingSchedule(null);
        setActiveFormMode(null);
      }

      setMessage("Xóa lịch học thành công.");
    } catch (requestError) {
      setError(
        getRequestErrorMessage(requestError, "Không thể xóa lịch học."),
      );
    } finally {
      setDeletingScheduleId(null);
      setScheduleToDelete(null);
    }
  };

  const deleteSubject = scheduleToDelete
    ? subjects.find(
        (subject) => String(subject._id) === String(scheduleToDelete.subject),
      )
    : null;

  return (
    <div className="space-y-6">
      {message || error ? (
        <div
          aria-live="polite"
          className="pointer-events-none fixed left-4 right-4 top-4 z-[90] flex flex-col gap-3 sm:left-auto sm:w-full sm:max-w-sm"
        >
          {message ? (
            <Toast type="success" onClose={() => setMessage("")}>
              {message}
            </Toast>
          ) : null}
          {error ? (
            <Toast type="error" onClose={() => setError("")}>
              {error}
            </Toast>
          ) : null}
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_60%,#ffffff_100%)] px-6 py-7 shadow-sm shadow-blue-100/50 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border-[26px] border-white/50" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-blue-200/70 bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#4f8edc]">
              Thời khóa biểu
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Lịch học trong tuần
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Sắp xếp từng buổi học theo môn, tiết và phòng để kế hoạch học tập luôn rõ ràng.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-2xl border border-white/80 bg-white/65 px-5 py-3 text-center shadow-sm backdrop-blur">
              <p className="text-2xl font-black text-[#4f8edc]">{schedules.length}</p>
              <p className="text-xs font-medium text-slate-500">Buổi học</p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              disabled={isLoading || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4f8edc] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <span className="text-xl font-light leading-none">+</span>
              Thêm lịch học
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Tổng lịch học", schedules.length, "LH", "bg-blue-50 text-blue-600"],
          ["Đang hiển thị", filteredSchedules.length, "HT", "bg-sky-50 text-sky-700"],
          ["Ngày có lịch", `${visibleDayCount}/${SCHEDULE_DAY_OPTIONS.length}`, "NG", "bg-emerald-50 text-emerald-700"],
        ].map(([label, value, code, tone]) => (
          <article
            key={label}
            className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</p>
              </div>
              <span className={`grid size-11 place-items-center rounded-2xl text-xs font-black ${tone}`}>
                {code}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/30 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Bộ lọc</p>
            <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900">Xem lịch theo môn học</h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Lọc theo môn học</span>
              <select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                disabled={isLoading}
                className="w-full rounded-2xl border border-blue-100 bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-800 outline-none transition hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">Tất cả môn học</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setSubjectFilter("")}
              disabled={!subjectFilter}
              className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Lịch theo tuần</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">Các buổi học hiện có</h2>
          </div>
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-bold text-slate-800">{filteredSchedules.length}</span> / {schedules.length} buổi
          </p>
        </div>

        {isLoading ? (
          <div aria-label="Đang tải lịch học" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-2xl border border-blue-100 bg-white p-5">
                <div className="h-5 w-20 rounded bg-blue-100" />
                <div className="mt-5 h-7 w-2/3 rounded bg-slate-100" />
                <div className="mt-6 h-20 rounded-2xl bg-blue-50" />
              </div>
            ))}
          </div>
        ) : (
          <ScheduleTable
            schedules={filteredSchedules}
            subjects={subjects}
            hasActiveFilter={Boolean(subjectFilter)}
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
            deletingScheduleId={deletingScheduleId}
          />
        )}
      </section>

      {isFormVisible ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Đóng form lịch học"
            onClick={closeForm}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingSchedule ? "Chỉnh sửa lịch học" : "Thêm lịch học mới"}
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] shadow-2xl shadow-slate-950/20"
          >
            <ScheduleForm
              key={editingSchedule ? `edit-${editingSchedule._id}` : "add-schedule"}
              mode={activeFormMode === "edit" ? "edit" : "add"}
              initialSchedule={editingSchedule}
              subjects={subjects}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      ) : null}

      {scheduleToDelete ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Đóng xác nhận xóa"
            onClick={closeDeleteDialog}
            disabled={Boolean(deletingScheduleId)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm disabled:cursor-wait"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-schedule-title"
            aria-describedby="delete-schedule-description"
            className="relative w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-7"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-7">
                <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
              </svg>
            </span>
            <h2 id="delete-schedule-title" className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Xóa lịch học?
            </h2>
            <p id="delete-schedule-description" className="mt-3 text-sm leading-6 text-slate-500">
              Bạn sắp xóa lịch <span className="font-bold text-slate-800">{deleteSubject?.name || "môn học này"}</span> vào {scheduleToDelete.dayOfWeek}. Dữ liệu đã xóa không thể khôi phục.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={Boolean(deletingScheduleId)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingScheduleId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-700 disabled:bg-rose-300"
              >
                {deletingScheduleId ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Đang xóa...
                  </>
                ) : "Xóa lịch học"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Schedule;
