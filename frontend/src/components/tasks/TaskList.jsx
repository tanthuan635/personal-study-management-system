import { useMemo } from "react";

import TaskCard from "./TaskCard";

function TaskList({
  tasks,
  subjects,
  hasActiveFilters,
  onEdit,
  onDelete,
  onToggleComplete,
}) {
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [Number(subject.id), subject]));
  }, [subjects]);

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-base font-medium text-slate-700">
          {hasActiveFilters
            ? "Không tìm thấy deadline phù hợp."
            : "Chưa có deadline nào."}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {hasActiveFilters
            ? "Hãy đổi bộ lọc hoặc tạo deadline mới."
            : "Nhấn nút Thêm deadline để tạo công việc đầu tiên."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          subject={subjectMap.get(Number(task.subjectId))}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

export default TaskList;
