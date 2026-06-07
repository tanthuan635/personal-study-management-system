import { useEffect, useMemo, useState } from "react";

import ScheduleForm from "../components/schedule/ScheduleForm";
import ScheduleTable from "../components/schedule/ScheduleTable";
import Toast from "../components/ui/Toast";
import {
  getNextScheduleId,
  loadSchedules,
  loadSubjects,
  saveSchedules,
  SCHEDULE_DAY_OPTIONS,
} from "../utils/storage";

function Schedule() {
  const [schedules, setSchedules] = useState(() => loadSchedules());
  const [subjects] = useState(() => loadSubjects());
  const [subjectFilter, setSubjectFilter] = useState("");
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    if (!subjectFilter) {
      return schedules;
    }

    return schedules.filter(
      (schedule) => String(schedule.subjectId) === subjectFilter,
    );
  }, [schedules, subjectFilter]);

  const visibleDayCount = useMemo(() => {
    const days = new Set(filteredSchedules.map((schedule) => schedule.dayOfWeek));
    return days.size;
  }, [filteredSchedules]);

  const showFeedback = (type, message) => {
    setFeedback({ id: Date.now(), type, message });
  };

  const isFormVisible = activeFormMode !== null;
  const addButtonLabel = activeFormMode === "add" ? "Đóng form" : "Thêm lịch học";

  const openAddForm = () => {
    if (activeFormMode === "add") {
      setActiveFormMode(null);
      setEditingSchedule(null);
      return;
    }

    setEditingSchedule(null);
    setActiveFormMode("add");
  };

  const closeForm = () => {
    setEditingSchedule(null);
    setActiveFormMode(null);
  };

  const handleSubmit = (scheduleData) => {
    try {
      if (activeFormMode === "edit" && editingSchedule) {
        setSchedules((currentSchedules) =>
          currentSchedules.map((schedule) =>
            schedule.id === editingSchedule.id
              ? { ...schedule, ...scheduleData }
              : schedule,
          ),
        );
        closeForm();
        showFeedback("success", "Đã cập nhật lịch học.");
        return;
      }

      setSchedules((currentSchedules) => {
        const nextSchedule = {
          id: getNextScheduleId(currentSchedules),
          ...scheduleData,
        };

        return [...currentSchedules, nextSchedule];
      });

      closeForm();
      showFeedback("success", "Đã thêm lịch học.");
    } catch {
      showFeedback("error", "Không thể lưu lịch học. Thử lại giúp mình nhé.");
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setActiveFormMode("edit");
  };

  const handleDelete = (scheduleId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa lịch học này không?");

    if (!shouldDelete) {
      return;
    }

    try {
      setSchedules((currentSchedules) =>
        currentSchedules.filter((schedule) => schedule.id !== scheduleId),
      );

      if (editingSchedule?.id === scheduleId) {
        closeForm();
      }

      showFeedback("success", "Đã xóa lịch học.");
    } catch {
      showFeedback("error", "Không thể xóa lịch học. Thử lại giúp mình nhé.");
    }
  };

  return (
    <div className="space-y-6">
      <Toast feedback={feedback} onClose={() => setFeedback(null)} />

      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Quản lý lịch học
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Thời khóa biểu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Thêm, sửa, xóa và lọc lịch học theo môn. Dữ liệu được lưu tạm vào
            localStorage.
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {addButtonLabel}
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Tổng lịch học</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {schedules.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Đang hiển thị</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {filteredSchedules.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Số ngày có lịch</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {visibleDayCount} / {SCHEDULE_DAY_OPTIONS.length}
          </p>
        </div>
      </section>

      {isFormVisible ? (
        <ScheduleForm
          mode={activeFormMode === "edit" ? "edit" : "add"}
          initialSchedule={editingSchedule}
          subjects={subjects}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : null}

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

        <ScheduleTable
          schedules={filteredSchedules}
          subjects={subjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
}

export default Schedule;
