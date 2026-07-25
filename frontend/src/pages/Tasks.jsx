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

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);
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
    if (isSubmitting) {
      return;
    }

    setError("");
    setMessage("");

    if (activeFormMode === "add") {
      setActiveFormMode(null);
      setEditingTask(null);
      return;
    }

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

  const handleDelete = async (taskId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa deadline này không?");

    if (!shouldDelete) {
      return;
    }

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
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Quản lý deadline
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Danh sách deadline
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Thêm, sửa, xóa, lọc và đánh dấu hoàn thành deadline trong tài khoản
            của bạn.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-sm">
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
          key={editingTask ? `edit-${editingTask._id}` : "add-task"}
          mode={activeFormMode === "edit" ? "edit" : "add"}
          initialTask={editingTask}
          subjects={subjects}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={isSubmitting}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold tracking-tight text-slate-900">
            Chưa mở form thêm deadline
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Nhấn nút <span className="font-medium text-slate-700">Thêm deadline</span>{" "}
            để tạo deadline mới.
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

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">
              Đang tải danh sách deadline...
            </p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            subjects={subjects}
            hasActiveFilters={hasActiveFilters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            deletingTaskId={deletingTaskId}
            updatingStatusTaskId={updatingStatusTaskId}
          />
        )}
      </section>
    </div>
  );
}

export default Tasks;
