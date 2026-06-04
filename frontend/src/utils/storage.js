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
