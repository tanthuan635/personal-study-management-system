export const SUBJECTS_STORAGE_KEY = "study-manager-subjects";

export const DEFAULT_SUBJECTS = [
  {
    id: 1,
    name: "Lập trình Web",
    code: "WEB101",
    teacher: "Nguyễn Văn A",
    credits: 3,
    description: "Môn học về lập trình giao diện web",
  },
];

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function cloneSubjects(subjects) {
  return subjects.map((subject) => ({ ...subject }));
}

function seedSubjects() {
  if (!canUseLocalStorage()) {
    return cloneSubjects(DEFAULT_SUBJECTS);
  }

  window.localStorage.setItem(
    SUBJECTS_STORAGE_KEY,
    JSON.stringify(DEFAULT_SUBJECTS),
  );

  return cloneSubjects(DEFAULT_SUBJECTS);
}

export function loadSubjects() {
  if (!canUseLocalStorage()) {
    return cloneSubjects(DEFAULT_SUBJECTS);
  }

  const storedValue = window.localStorage.getItem(SUBJECTS_STORAGE_KEY);

  if (!storedValue) {
    return seedSubjects();
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return seedSubjects();
    }

    return parsedValue;
  } catch {
    return seedSubjects();
  }
}

export function saveSubjects(subjects) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
}

export function getNextSubjectId(subjects) {
  return subjects.reduce((maxId, subject) => {
    const subjectId = Number(subject.id) || 0;
    return Math.max(maxId, subjectId);
  }, 0) + 1;
}

export const TASKS_STORAGE_KEY = "study-manager-tasks";

export const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Làm bài tập React",
    subjectId: 1,
    dueDate: "2026-06-10",
    priority: "Cao",
    status: "Chưa làm",
    note: "Hoàn thành component quản lý môn học",
  },
];

export const TASK_STATUS_OPTIONS = ["Chưa làm", "Đang làm", "Hoàn thành"];

export const TASK_PRIORITY_OPTIONS = ["Thấp", "Trung bình", "Cao"];

export const TASK_WARNING_DAYS = 3;

function cloneTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

function seedTasks() {
  if (!canUseLocalStorage()) {
    return cloneTasks(DEFAULT_TASKS);
  }

  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));

  return cloneTasks(DEFAULT_TASKS);
}

export function loadTasks() {
  if (!canUseLocalStorage()) {
    return cloneTasks(DEFAULT_TASKS);
  }

  const storedValue = window.localStorage.getItem(TASKS_STORAGE_KEY);

  if (!storedValue) {
    return seedTasks();
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return seedTasks();
    }

    return parsedValue;
  } catch {
    return seedTasks();
  }
}

export function saveTasks(tasks) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

export function getNextTaskId(tasks) {
  return tasks.reduce((maxId, task) => {
    const taskId = Number(task.id) || 0;
    return Math.max(maxId, taskId);
  }, 0) + 1;
}

function getStartOfDay(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getTaskDeadlineState(task, referenceDate = new Date()) {
  if (!task?.dueDate || task.status === "Hoàn thành") {
    return null;
  }

  const dueDate = new Date(`${task.dueDate}T00:00:00`);

  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  const diffDays = Math.round(
    (getStartOfDay(dueDate) - getStartOfDay(referenceDate)) / 86400000,
  );

  if (diffDays < 0) {
    return {
      kind: "overdue",
      label: `Quá hạn ${Math.abs(diffDays)} ngày`,
      daysUntilDue: diffDays,
    };
  }

  if (diffDays === 0) {
    return {
      kind: "warning",
      label: "Hết hạn hôm nay",
      daysUntilDue: diffDays,
    };
  }

  if (diffDays <= TASK_WARNING_DAYS) {
    return {
      kind: "warning",
      label: `Còn ${diffDays} ngày`,
      daysUntilDue: diffDays,
    };
  }

  return {
    kind: "normal",
    label: `Còn ${diffDays} ngày`,
    daysUntilDue: diffDays,
  };
}
