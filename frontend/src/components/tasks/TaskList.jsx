import { useMemo } from "react";

import TaskCard from "./TaskCard";

function TaskList({ tasks, subjects, hasActiveFilters, onEdit, onDelete, onToggleComplete, deletingTaskId, updatingStatusTaskId }) {
  const subjectMap = useMemo(() => new Map(subjects.map((subject) => [String(subject._id), subject])), [subjects]);

  if (tasks.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-blue-200 bg-blue-50/40 px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-2xl font-light text-[#4f8edc] shadow-sm">{hasActiveFilters ? "?" : "+"}</span>
        <p className="mt-4 text-base font-bold text-slate-700">{hasActiveFilters ? "Không tìm thấy deadline phù hợp" : "Chưa có deadline nào"}</p>
        <p className="mt-2 text-sm text-slate-500">{hasActiveFilters ? "Hãy đổi bộ lọc hoặc tạo deadline mới." : "Nhấn Thêm deadline để tạo công việc đầu tiên."}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} subject={subjectMap.get(String(task.subject))} onEdit={onEdit} onDelete={onDelete} onToggleComplete={onToggleComplete} isDeleting={deletingTaskId === task._id} isUpdatingStatus={updatingStatusTaskId === task._id} />
      ))}
    </div>
  );
}

export default TaskList;
