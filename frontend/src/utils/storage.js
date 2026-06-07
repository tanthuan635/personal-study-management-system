import {
  DEFAULT_DOCUMENTS,
  DEFAULT_SCHEDULES,
  DEFAULT_SUBJECTS,
  DEFAULT_TASKS,
  DOCUMENTS_STORAGE_KEY,
  DOCUMENT_TYPE_OPTIONS,
  SCHEDULE_DAY_OPTIONS,
  SCHEDULE_LONG_BREAK_AFTER_PERIODS,
  SCHEDULE_PERIOD_BREAK_MINUTES,
  SCHEDULE_PERIOD_LENGTH_MINUTES,
  SCHEDULE_PERIOD_LONG_BREAK_MINUTES,
  SCHEDULE_PERIOD_OPTIONS,
  SCHEDULES_STORAGE_KEY,
  SUBJECTS_STORAGE_KEY,
  TASKS_STORAGE_KEY,
  TASK_WARNING_DAYS,
} from "./constants";

export * from "./constants";

export const getStorageData = (key, defaultValue = []) => {
  if (typeof localStorage === "undefined") {
    return defaultValue;
  }

  const data = localStorage.getItem(key);

  if (!data) {
    return defaultValue;
  }

  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

export const setStorageData = (key, value) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

function cloneItems(items) {
  return items.map((item) => ({ ...item }));
}

function loadItems(storageKey, defaultItems) {
  const items = getStorageData(storageKey, defaultItems);

  return Array.isArray(items) ? cloneItems(items) : cloneItems(defaultItems);
}

function saveItems(storageKey, items) {
  setStorageData(storageKey, items);
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

  for (
    let currentPeriod = firstPeriodInSession;
    currentPeriod < periodNumber;
    currentPeriod += 1
  ) {
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
