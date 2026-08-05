import { useMemo } from "react";
import viLocale from "@fullcalendar/core/locales/vi";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import {
  getSchedulePeriodLabel,
  getScheduleTimeRange,
  SCHEDULE_DAY_OPTIONS,
} from "../../utils/storage";

function getFullCalendarDayIndex(dayOfWeek) {
  const optionIndex = SCHEDULE_DAY_OPTIONS.indexOf(dayOfWeek);

  if (optionIndex < 0) {
    return null;
  }

  return optionIndex === SCHEDULE_DAY_OPTIONS.length - 1
    ? 0
    : optionIndex + 1;
}

function getScheduleTimes(schedule) {
  const [periodStartTime, periodEndTime] =
    getScheduleTimeRange(schedule).split(" - ");

  return {
    startTime: schedule.startTime || periodStartTime,
    endTime: schedule.endTime || periodEndTime,
  };
}

function ScheduleEventContent({
  eventInfo,
  onDelete,
  deletingScheduleId,
}) {
  const { schedule, subject } = eventInfo.event.extendedProps;
  const isDeleting = deletingScheduleId === schedule._id;

  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete(schedule._id);
  };

  return (
    <div className="schedule-calendar-event">
      <div className="schedule-calendar-event__content">
        <p className="schedule-calendar-event__code">
          {subject?.code || "Môn đã xóa"}
        </p>
        <p className="schedule-calendar-event__title">
          {subject?.name || eventInfo.event.title}
        </p>
        <p className="schedule-calendar-event__meta">
          {getSchedulePeriodLabel(schedule)} · {schedule.room}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Xóa lịch ${subject?.name || "môn học"}`}
        title="Xóa lịch học"
        onClick={handleDelete}
        disabled={isDeleting}
        className="schedule-calendar-event__delete"
      >
        {isDeleting ? (
          <span className="schedule-calendar-event__spinner" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
          </svg>
        )}
      </button>
    </div>
  );
}

function ScheduleTable({
  schedules,
  subjects,
  hasActiveFilter = false,
  onEdit,
  onDelete,
  deletingScheduleId,
}) {
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [String(subject._id), subject]));
  }, [subjects]);

  const calendarEvents = useMemo(() => {
    return schedules
      .map((schedule) => {
        const dayIndex = getFullCalendarDayIndex(schedule.dayOfWeek);

        if (dayIndex === null) {
          return null;
        }

        const subject = subjectMap.get(String(schedule.subject));
        const { startTime, endTime } = getScheduleTimes(schedule);

        return {
          id: String(schedule._id),
          title: subject?.name || "Môn học đã xóa",
          daysOfWeek: [dayIndex],
          startTime,
          endTime,
          backgroundColor: "transparent",
          borderColor: "transparent",
          textColor: "#0f172a",
          extendedProps: {
            schedule,
            subject,
          },
        };
      })
      .filter(Boolean);
  }, [schedules, subjectMap]);

  if (schedules.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-blue-200 bg-blue-50/40 px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#4f8edc] shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6">
            <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
            <path d="M9 14h6M12 11v6" />
          </svg>
        </span>
        <p className="mt-4 text-base font-bold text-slate-700">
          {hasActiveFilter
            ? "Không có lịch học thuộc môn này"
            : "Chưa có lịch học nào"}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {hasActiveFilter
            ? "Hãy chọn môn học khác hoặc xóa bộ lọc."
            : "Nhấn Thêm lịch học để tạo buổi học đầu tiên."}
        </p>
      </div>
    );
  }

  return (
    <div className="schedule-calendar overflow-x-auto rounded-[2rem] border border-blue-100 bg-white p-3 shadow-sm shadow-blue-100/30 sm:p-5">
      <div className="min-w-[920px]">
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          firstDay={1}
          allDaySlot={false}
          weekends
          nowIndicator
          stickyHeaderDates
          expandRows
          height={760}
          slotMinTime="07:00:00"
          slotMaxTime="18:30:00"
          scrollTime="07:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          dayHeaderFormat={{ weekday: "short", day: "2-digit", month: "2-digit" }}
          slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          buttonText={{ today: "Tuần này" }}
          events={calendarEvents}
          eventContent={(eventInfo) => (
            <ScheduleEventContent
              eventInfo={eventInfo}
              onDelete={onDelete}
              deletingScheduleId={deletingScheduleId}
            />
          )}
          eventClick={(clickInfo) => {
            onEdit(clickInfo.event.extendedProps.schedule);
          }}
          eventDidMount={(mountInfo) => {
            const { schedule, subject } = mountInfo.event.extendedProps;
            mountInfo.el.title = `${subject?.name || "Môn học"} · ${getSchedulePeriodLabel(schedule)} · Phòng ${schedule.room}. Nhấp để chỉnh sửa.`;
          }}
        />
      </div>
      <p className="mt-3 text-center text-xs font-medium text-slate-400 sm:hidden">
        Vuốt ngang để xem đầy đủ các ngày trong tuần.
      </p>
    </div>
  );
}

export default ScheduleTable;
