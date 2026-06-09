import { useEffect, useMemo, useState } from "react";

import TaskFilter from "../components/tasks/TaskFilter";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import {
  getNextTaskId,
  getTaskDeadlineState,
  loadSubjects,
  loadTasks,
  saveTasks,
} from "../utils/storage";

function Tasks() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [subjects] = useState(() => loadSubjects());
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;

      return matchesStatus && matchesPriority;
    });
  }, [priorityFilter, statusFilter, tasks]);

  const taskStats = useMemo(() => {
    return tasks.reduce(
      (accumulator, task) => {
        const deadlineState = getTaskDeadlineState(task);

        if (task.status === "Hoàn thành") {
          accumulator.completed += 1;
        }

        if (deadlineState?.kind === "overdue") {
          accumulator.overdue += 1;
        }

        if (deadlineState?.kind === "warning") {
          accumulator.dueSoon += 1;
        }

        return accumulator;
      },
      { completed: 0, overdue: 0, dueSoon: 0 },
    );
  }, [tasks]);

  const hasActiveFilters = Boolean(statusFilter || priorityFilter);
  const isFormVisible = activeFormMode !== null;
  const addButtonLabel = activeFormMode === "add" ? "Đóng form" : "Thêm deadline";

  const openAddForm = () => {
    if (activeFormMode === "add") {
      setActiveFormMode(null);
      setEditingTask(null);
      return;
    }

    setEditingTask(null);
    setActiveFormMode("add");
  };

  const closeForm = () => {
    setEditingTask(null);
    setActiveFormMode(null);
  };

  const handleSubmit = (taskData) => {
    if (activeFormMode === "edit" && editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task,
        ),
      );
      closeForm();
      return;
    }

    setTasks((currentTasks) => {
      const nextTask = {
        id: getNextTaskId(currentTasks),
        ...taskData,
      };

      return [...currentTasks, nextTask];
    });

    closeForm();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setActiveFormMode("edit");
  };

  const handleDelete = (taskId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa deadline này không?");

    if (!shouldDelete) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );

    if (editingTask?.id === taskId) {
      closeForm();
    }
  };

  const handleToggleComplete = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Hoàn thành" } : task,
      ),
    );

    if (editingTask?.id === taskId) {
      closeForm();
    }
  };

  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Quản lý deadline
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Danh sách deadline
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Thêm, sửa, xóa, lọc và đánh dấu hoàn thành deadline. Dữ liệu được lưu
            tạm vào localStorage.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-sm">
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {addButtonLabel}
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Tổng deadline</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {totalTasks}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Quá hạn</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-rose-700">
            {taskStats.overdue}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Sắp tới</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-700">
            {taskStats.dueSoon}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Hoàn thành</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-700">
            {taskStats.completed}
          </p>
        </div>
      </section>

      <TaskFilter
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onReset={() => {
          setStatusFilter("");
          setPriorityFilter("");
        }}
      />

      {isFormVisible ? (
        <TaskForm
          key={editingTask ? `edit-${editingTask.id}` : "add-task"}
          mode={activeFormMode === "edit" ? "edit" : "add"}
          initialTask={editingTask}
          subjects={subjects}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold tracking-tight text-slate-900">
            Chưa mở form thêm deadline
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Nhấn nút <span className="font-medium text-slate-700">Thêm deadline</span> để tạo deadline mới.
          </p>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Deadline hiện có
            </h2>
            <p className="text-sm text-slate-500">
              {filteredTasks.length} / {totalTasks} deadline đang hiển thị
            </p>
          </div>
        </div>

        <TaskList
          tasks={filteredTasks}
          subjects={subjects}
          hasActiveFilters={hasActiveFilters}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      </section>
    </div>
  );
}

export default Tasks;
