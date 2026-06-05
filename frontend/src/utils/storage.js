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

export const SCHEDULES_STORAGE_KEY = "study-manager-schedules";

export const SCHEDULE_DAY_OPTIONS = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

export const SCHEDULE_PERIOD_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => index + 1,
);

export const SCHEDULE_PERIOD_LENGTH_MINUTES = 45;

export const SCHEDULE_PERIOD_BREAK_MINUTES = 5;

export const SCHEDULE_PERIOD_LONG_BREAK_MINUTES = 15;

export const SCHEDULE_LONG_BREAK_AFTER_PERIODS = [3, 9];

export const DEFAULT_SCHEDULES = [
  {
    id: 1,
    subjectId: 1,
    dayOfWeek: "Thứ 2",
    startPeriod: 1,
    endPeriod: 3,
    room: "A101",
    note: "Học lý thuyết",
  },
];

export const DOCUMENTS_STORAGE_KEY = "study-manager-documents";

export const DOCUMENT_TYPE_OPTIONS = ["PDF", "DOCX", "PPTX", "Video", "Link", "Khác"];

export const DEFAULT_DOCUMENTS = [
  {
    id: 1,
    title: "Slide React cơ bản",
    subjectId: 1,
    fileName: "react-basic.pdf",
    type: "PDF",
    uploadDate: "2026-06-04",
    description: "Tài liệu học React",
  },
];

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function cloneItems(items) {
  return items.map((item) => ({ ...item }));
}

function seedItems(storageKey, defaultItems) {
  if (!canUseLocalStorage()) {
    return cloneItems(defaultItems);
  }

  window.localStorage.setItem(storageKey, JSON.stringify(defaultItems));

  return cloneItems(defaultItems);
}

function loadItems(storageKey, defaultItems) {
  if (!canUseLocalStorage()) {
    return cloneItems(defaultItems);
  }

  const storedValue = window.localStorage.getItem(storageKey);

  if (!storedValue) {
    return seedItems(storageKey, defaultItems);
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return seedItems(storageKey, defaultItems);
    }

    return parsedValue;
  } catch {
    return seedItems(storageKey, defaultItems);
  }
}

function saveItems(storageKey, items) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(items));
}

function getNextId(items) {
  return items.reduce((maxId, item) => {
    const itemId = Number(item.id) || 0;
    return Math.max(maxId, itemId);
  }, 0) + 1;
}

export function loadSubjects() {
  return loadItems(SUBJECTS_STORAGE_KEY, DEFAULT_SUBJECTS);
}

export function saveSubjects(subjects) {
  saveItems(SUBJECTS_STORAGE_KEY, subjects);
}

export function getNextSubjectId(subjects) {
  return getNextId(subjects);
}

export function loadTasks() {
  return loadItems(TASKS_STORAGE_KEY, DEFAULT_TASKS);
}

export function saveTasks(tasks) {
  saveItems(TASKS_STORAGE_KEY, tasks);
}

export function getNextTaskId(tasks) {
  return getNextId(tasks);
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

function getPeriodStartMinute(period) {
  const periodNumber = Number(period);
  const sessionStartMinute = periodNumber >= 7 ? 13 * 60 : 7 * 60;
  const firstPeriodInSession = periodNumber >= 7 ? 7 : 1;
  let startMinute = sessionStartMinute;

  for (let currentPeriod = firstPeriodInSession; currentPeriod < periodNumber; currentPeriod += 1) {
    const breakMinutes = SCHEDULE_LONG_BREAK_AFTER_PERIODS.includes(currentPeriod)
      ? SCHEDULE_PERIOD_LONG_BREAK_MINUTES
      : SCHEDULE_PERIOD_BREAK_MINUTES;

    startMinute += SCHEDULE_PERIOD_LENGTH_MINUTES + breakMinutes;
  }

  return startMinute;
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
}

function getPeriodFromTime(timeValue, fallbackPeriod) {
  if (!timeValue) {
    return fallbackPeriod;
  }

  const [hours, minutes] = timeValue.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  const matchedPeriod = SCHEDULE_PERIOD_OPTIONS.find((period) => {
    const startMinute = getPeriodStartMinute(period);
    const endMinute = startMinute + SCHEDULE_PERIOD_LENGTH_MINUTES;

    return totalMinutes >= startMinute && totalMinutes <= endMinute;
  });

  return matchedPeriod || fallbackPeriod;
}

function normalizeSchedule(schedule) {
  const startPeriod = Number(
    schedule.startPeriod || getPeriodFromTime(schedule.startTime, 1),
  );
  const endPeriod = Number(
    schedule.endPeriod || getPeriodFromTime(schedule.endTime, startPeriod),
  );

  return {
    id: schedule.id,
    subjectId: Number(schedule.subjectId) || 1,
    dayOfWeek: schedule.dayOfWeek || SCHEDULE_DAY_OPTIONS[0],
    startPeriod,
    endPeriod: Math.max(startPeriod, endPeriod),
    room: schedule.room || "",
    note: schedule.note || "",
  };
}

export function loadSchedules() {
  return loadItems(SCHEDULES_STORAGE_KEY, DEFAULT_SCHEDULES).map(normalizeSchedule);
}

export function saveSchedules(schedules) {
  saveItems(SCHEDULES_STORAGE_KEY, schedules.map(normalizeSchedule));
}

export function getNextScheduleId(schedules) {
  return getNextId(schedules);
}

export function getPeriodTimeRange(startPeriod, endPeriod = startPeriod) {
  const normalizedStartPeriod = Number(startPeriod) || 1;
  const normalizedEndPeriod = Math.max(
    normalizedStartPeriod,
    Number(endPeriod) || normalizedStartPeriod,
  );
  const startMinute = getPeriodStartMinute(normalizedStartPeriod);
  const endMinute =
    getPeriodStartMinute(normalizedEndPeriod) + SCHEDULE_PERIOD_LENGTH_MINUTES;

  return `${formatMinutes(startMinute)} - ${formatMinutes(endMinute)}`;
}

export function getSchedulePeriodLabel(schedule) {
  if (Number(schedule.startPeriod) === Number(schedule.endPeriod)) {
    return `Tiết ${schedule.startPeriod}`;
  }

  return `Tiết ${schedule.startPeriod} - ${schedule.endPeriod}`;
}

export function getScheduleTimeRange(schedule) {
  return getPeriodTimeRange(schedule.startPeriod, schedule.endPeriod);
}

export function sortSchedulesByPeriod(schedules) {
  return [...schedules].sort((firstSchedule, secondSchedule) => {
    const startDiff =
      Number(firstSchedule.startPeriod) - Number(secondSchedule.startPeriod);

    if (startDiff !== 0) {
      return startDiff;
    }

    return Number(firstSchedule.endPeriod) - Number(secondSchedule.endPeriod);
  });
}

function normalizeDocument(documentItem) {
  return {
    id: documentItem.id,
    title: documentItem.title || "",
    subjectId: Number(documentItem.subjectId) || 1,
    fileName: documentItem.fileName || "",
    type: documentItem.type || DOCUMENT_TYPE_OPTIONS[0],
    uploadDate: documentItem.uploadDate || "",
    description: documentItem.description || "",
  };
}

export function loadDocuments() {
  return loadItems(DOCUMENTS_STORAGE_KEY, DEFAULT_DOCUMENTS).map(normalizeDocument);
}

export function saveDocuments(documents) {
  saveItems(DOCUMENTS_STORAGE_KEY, documents.map(normalizeDocument));
}

export function getNextDocumentId(documents) {
  return getNextId(documents);
}
