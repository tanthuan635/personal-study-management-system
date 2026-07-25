import { useMemo } from "react";

import {
  SCHEDULE_DAY_OPTIONS,
  sortSchedulesByPeriod,
} from "../../utils/storage";
import ScheduleCard from "./ScheduleCard";

function ScheduleTable({
  schedules,
  subjects,
  onEdit,
  onDelete,
  deletingScheduleId,
}) {
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [String(subject._id), subject]));
  }, [subjects]);

  const schedulesByDay = useMemo(() => {
    return SCHEDULE_DAY_OPTIONS.reduce((accumulator, day) => {
      accumulator[day] = sortSchedulesByPeriod(
        schedules.filter((schedule) => schedule.dayOfWeek === day),
      );

      return accumulator;
    }, {});
  }, [schedules]);

  if (schedules.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-base font-medium text-slate-700">
          Chưa có lịch học phù hợp.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Hãy thêm lịch học mới hoặc đổi bộ lọc môn học.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[980px] table-fixed border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {SCHEDULE_DAY_OPTIONS.map((day) => (
              <th
                key={day}
                className="w-[140px] px-3 py-4 text-left text-sm font-semibold text-slate-700"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            {SCHEDULE_DAY_OPTIONS.map((day) => (
              <td key={day} className="border-r border-slate-100 p-3 last:border-r-0">
                <div className="min-h-[180px] space-y-3">
                  {schedulesByDay[day].length > 0 ? (
                    schedulesByDay[day].map((schedule) => (
                      <ScheduleCard
                        key={schedule._id}
                        schedule={schedule}
                        subject={subjectMap.get(String(schedule.subject))}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isDeleting={deletingScheduleId === schedule._id}
                      />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400">
                      Trống
                    </div>
                  )}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
