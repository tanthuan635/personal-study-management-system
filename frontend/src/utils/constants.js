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

export const DOCUMENT_TYPE_OPTIONS = [
  "PDF",
  "DOC",
  "DOCX",
  "PPT",
  "PPTX",
  "JPG",
  "JPEG",
  "PNG",
  "GIF",
  "WEBP",
  "Video",
  "Link",
  "Khác",
];

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
