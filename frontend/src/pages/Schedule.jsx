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
  const endPeriod = getPeriodFromTime(
    schedule.endTime,
    "end",
    startPeriod,
  );

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

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);
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

  const filteredSchedules = useMemo(() => {
    if (!subjectFilter) {
      return schedules;
    }

    return schedules.filter(
      (schedule) => String(schedule.subject) === subjectFilter,
    );
  }, [schedules, subjectFilter]);

  const visibleDayCount = useMemo(() => {
    const days = new Set(filteredSchedules.map((schedule) => schedule.dayOfWeek));
    return days.size;
  }, [filteredSchedules]);

  const isFormVisible = activeFormMode !== null;
  const addButtonLabel = activeFormMode === "add" ? "Đóng form" : "Thêm lịch học";

  const openAddForm = () => {
    setError("");
    setMessage("");

    if (activeFormMode === "add") {
      setActiveFormMode(null);
      setEditingSchedule(null);
      return;
    }

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

  const handleDelete = async (scheduleId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa lịch học này không?");

    if (!shouldDelete) {
      return;
    }

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
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Quản lý lịch học
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Thời khóa biểu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Thêm, sửa, xóa và lọc lịch học theo môn trong tài khoản của bạn.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-sm">
          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Lọc theo môn học
            </span>
            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
            onClick={openAddForm}
            disabled={isLoading || isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {addButtonLabel}
          </button>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Tổng lịch học</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {schedules.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Đang hiển thị</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {filteredSchedules.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Số ngày có lịch</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {visibleDayCount} / {SCHEDULE_DAY_OPTIONS.length}
          </p>
        </div>
      </section>

      {isFormVisible ? (
        <ScheduleForm
          key={editingSchedule ? `edit-${editingSchedule._id}` : "add-schedule"}
          mode={activeFormMode === "edit" ? "edit" : "add"}
          initialSchedule={editingSchedule}
          subjects={subjects}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={isSubmitting}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold tracking-tight text-slate-900">
            Chưa mở form thêm lịch học
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Nhấn nút <span className="font-medium text-slate-700">Thêm lịch học</span>{" "}
            để tạo buổi học mới.
          </p>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Lịch học theo tuần
            </h2>
            <p className="text-sm text-slate-500">
              {filteredSchedules.length} / {schedules.length} buổi học đang hiển thị
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">
              Đang tải lịch học...
            </p>
          </div>
        ) : (
          <ScheduleTable
            schedules={filteredSchedules}
            subjects={subjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingScheduleId={deletingScheduleId}
          />
        )}
      </section>
    </div>
  );
}

export default Schedule;
