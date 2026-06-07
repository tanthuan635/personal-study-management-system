import { useMemo } from "react";

import EmptyState from "../ui/EmptyState";
import TaskCard from "./TaskCard";

function TaskList({
  tasks,
  subjects,
  hasTasks,
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
      <EmptyState
        title={
          hasTasks && hasActiveFilters
            ? "Không tìm thấy deadline phù hợp."
            : "Chưa có deadline nào."
        }
        description={
          hasTasks && hasActiveFilters
            ? "Hãy đổi bộ lọc hoặc tạo deadline mới."
            : "Nhấn nút Thêm deadline để tạo công việc đầu tiên."
        }
      />
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
