import { useEffect, useMemo, useState } from "react";

import { getSubjects } from "../api/subjectApi";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../api/taskApi";
import TaskFilter from "../components/tasks/TaskFilter";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import { getTaskDeadlineState } from "../utils/storage";

function getRequestErrorMessage(error, fallbackMessage) {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || fallbackMessage;
}

function normalizeTask(task) {
  return {
    ...task,
    dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : "",
  };
}

function sortTasksByDueDate(tasks) {
  return [...tasks].sort((firstTask, secondTask) =>
    firstTask.dueDate.localeCompare(secondTask.dueDate),
  );
}

function Toast({ type, children, onClose }) {
  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
        isSuccess
          ? "border-emerald-200 shadow-emerald-900/10"
          : "border-red-200 shadow-red-900/10"
      }`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-black ${
          isSuccess
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isSuccess ? "✓" : "!"}
      </span>
      <p
        className={`min-w-0 flex-1 pt-1 text-sm font-semibold leading-6 ${
          isSuccess ? "text-emerald-700" : "text-red-700"
        }`}
      >
        {children}
      </p>
      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={onClose}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [updatingStatusTaskId, setUpdatingStatusTaskId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadTaskPageData() {
      setIsLoading(true);
      setError("");

      try {
        const [taskResponse, subjectResponse] = await Promise.all([
          getTasks(),
          getSubjects(),
        ]);

        if (isActive) {
          setTasks((taskResponse.data.data || []).map(normalizeTask));
          setSubjects(subjectResponse.data.data || []);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            getRequestErrorMessage(
              requestError,
              "Không thể tải dữ liệu deadline.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadTaskPageData();

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

  const openAddForm = () => {
    if (isSubmitting) {
      return;
    }

    setError("");
    setMessage("");
    setEditingTask(null);
    setActiveFormMode("add");
  };

  const closeForm = () => {
    if (isSubmitting) {
      return;
    }

    setEditingTask(null);
    setActiveFormMode(null);
  };

  const handleSubmit = async (taskData) => {
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (activeFormMode === "edit" && editingTask) {
        const response = await updateTask(editingTask._id, taskData);
        const updatedTask = normalizeTask(response.data.data);

        setTasks((currentTasks) =>
          sortTasksByDueDate(
            currentTasks.map((task) =>
              task._id === updatedTask._id ? updatedTask : task,
            ),
          ),
        );
        setMessage("Cập nhật deadline thành công.");
      } else {
        const response = await createTask(taskData);
        const createdTask = normalizeTask(response.data.data);

        setTasks((currentTasks) =>
          sortTasksByDueDate([...currentTasks, createdTask]),
        );
        setMessage("Thêm deadline thành công.");
      }

      setEditingTask(null);
      setActiveFormMode(null);
    } catch (requestError) {
      setError(
        getRequestErrorMessage(
          requestError,
          activeFormMode === "edit"
            ? "Không thể cập nhật deadline."
            : "Không thể thêm deadline.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setError("");
    setMessage("");
    setEditingTask(task);
    setActiveFormMode("edit");
  };

  const openDeleteDialog = (taskId) => {
    const selectedTask = tasks.find((task) => task._id === taskId);

    if (!selectedTask) {
      return;
    }

    setError("");
    setMessage("");
    setTaskToDelete(selectedTask);
  };

  const closeDeleteDialog = () => {
    if (!deletingTaskId) {
      setTaskToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    const taskId = taskToDelete._id;
    setDeletingTaskId(taskId);
    setError("");
    setMessage("");

    try {
      await deleteTask(taskId);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId),
      );

      if (editingTask?._id === taskId) {
        setEditingTask(null);
        setActiveFormMode(null);
      }

      setMessage("Xóa deadline thành công.");
    } catch (requestError) {
      setError(
        getRequestErrorMessage(requestError, "Không thể xóa deadline."),
      );
    } finally {
      setDeletingTaskId(null);
      setTaskToDelete(null);
    }
  };

  const handleToggleComplete = async (taskId) => {
    setUpdatingStatusTaskId(taskId);
    setError("");
    setMessage("");

    try {
      const response = await updateTaskStatus(taskId, "Hoàn thành");
      const updatedTask = normalizeTask(response.data.data);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task,
        ),
      );

      if (editingTask?._id === taskId) {
        setEditingTask(null);
        setActiveFormMode(null);
      }

      setMessage("Đã đánh dấu deadline hoàn thành.");
    } catch (requestError) {
      setError(
        getRequestErrorMessage(
          requestError,
          "Không thể cập nhật trạng thái deadline.",
        ),
      );
    } finally {
      setUpdatingStatusTaskId(null);
    }
  };

  const totalTasks = tasks.length;

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
              Quản lý deadline
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Kế hoạch cần hoàn thành
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Theo dõi hạn nộp, mức ưu tiên và tiến độ để không bỏ sót công việc
              quan trọng.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-2xl border border-white/80 bg-white/65 px-5 py-3 text-center shadow-sm backdrop-blur">
              <p className="text-2xl font-black text-[#4f8edc]">{totalTasks}</p>
              <p className="text-xs font-medium text-slate-500">Deadline</p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              disabled={isLoading || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4f8edc] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <span className="text-xl font-light leading-none">+</span>
              Thêm deadline
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng deadline", totalTasks, "DL", "bg-blue-50 text-blue-600"],
          ["Quá hạn", taskStats.overdue, "QH", "bg-rose-50 text-rose-600"],
          ["Sắp tới", taskStats.dueSoon, "ST", "bg-amber-50 text-amber-700"],
          ["Hoàn thành", taskStats.completed, "HT", "bg-emerald-50 text-emerald-700"],
        ].map(([label, value, code, tone]) => (
          <article
            key={label}
            className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {value}
                </p>
              </div>
              <span className={`grid size-11 place-items-center rounded-2xl text-xs font-black ${tone}`}>
                {code}
              </span>
            </div>
          </article>
        ))}
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

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
              Danh sách công việc
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
              Deadline hiện có
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-bold text-slate-800">{filteredTasks.length}</span> / {totalTasks}
          </p>
        </div>

        {isLoading ? (
          <div
            aria-label="Đang tải danh sách deadline"
            className="grid gap-4 xl:grid-cols-2"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl border border-blue-100 bg-white p-5"
              >
                <div className="h-5 w-24 rounded bg-blue-100" />
                <div className="mt-5 h-7 w-2/3 rounded bg-slate-100" />
                <div className="mt-6 h-20 rounded-2xl bg-blue-50" />
                <div className="mt-5 h-4 w-1/2 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            subjects={subjects}
            hasActiveFilters={hasActiveFilters}
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
            onToggleComplete={handleToggleComplete}
            deletingTaskId={deletingTaskId}
            updatingStatusTaskId={updatingStatusTaskId}
          />
        )}
      </section>

      {isFormVisible ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Đóng form deadline"
            onClick={closeForm}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingTask ? "Chỉnh sửa deadline" : "Thêm deadline mới"}
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] shadow-2xl shadow-slate-950/20"
          >
            <TaskForm
              key={editingTask ? `edit-${editingTask._id}` : "add-task"}
              mode={activeFormMode === "edit" ? "edit" : "add"}
              initialTask={editingTask}
              subjects={subjects}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      ) : null}

      {taskToDelete ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Đóng xác nhận xóa"
            onClick={closeDeleteDialog}
            disabled={Boolean(deletingTaskId)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm disabled:cursor-wait"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            aria-describedby="delete-task-description"
            className="relative w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-7"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-7">
                <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
              </svg>
            </span>
            <h2 id="delete-task-title" className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Xóa deadline?
            </h2>
            <p id="delete-task-description" className="mt-3 text-sm leading-6 text-slate-500">
              Bạn sắp xóa <span className="font-bold text-slate-800">{taskToDelete.title}</span>. Dữ liệu đã xóa không thể khôi phục.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeDeleteDialog} disabled={Boolean(deletingTaskId)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60">
                Hủy
              </button>
              <button type="button" onClick={confirmDelete} disabled={Boolean(deletingTaskId)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-700 disabled:bg-rose-300">
                {deletingTaskId ? (
                  <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Đang xóa...</>
                ) : "Xóa deadline"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Tasks;
