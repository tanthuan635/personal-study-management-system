export const COMPLETED_TASK_STATUS = "Hoàn thành";

function isCompletedTask(task) {
  return task.status === COMPLETED_TASK_STATUS;
}

function parseDate(dateValue) {
  const parsedDate = new Date(`${dateValue}T00:00:00`);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function getStartOfDay(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCompletionRate(completedCount, totalCount) {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
}

export function getSubjectProgress(subjects, tasks) {
  return subjects.map((subject) => {
    const subjectTasks = tasks.filter(
      (task) => Number(task.subjectId) === Number(subject.id),
    );
    const completedTasks = subjectTasks.filter(isCompletedTask).length;
    const pendingTasks = subjectTasks.length - completedTasks;

    return {
      subject,
      totalTasks: subjectTasks.length,
      completedTasks,
      pendingTasks,
      completionRate: getCompletionRate(completedTasks, subjectTasks.length),
    };
  });
}

export function getTopSubjectByDeadline(subjects, tasks) {
  const progressList = getSubjectProgress(subjects, tasks);

  return progressList.reduce((topSubject, currentSubject) => {
    if (!topSubject || currentSubject.totalTasks > topSubject.totalTasks) {
      return currentSubject;
    }

    return topSubject;
  }, null);
}

export function getNearestDeadline(tasks, referenceDate = new Date()) {
  const today = getStartOfDay(referenceDate);
  const incompleteTasks = tasks.filter(
    (task) => !isCompletedTask(task) && task.dueDate,
  );

  const taskDates = incompleteTasks
    .map((task) => {
      const dueDate = parseDate(task.dueDate);

      if (!dueDate) {
        return null;
      }

      return {
        task,
        dueDate,
        daysUntilDue: Math.round((getStartOfDay(dueDate) - today) / 86400000),
      };
    })
    .filter(Boolean);

  if (taskDates.length === 0) {
    return null;
  }

  const upcomingTasks = taskDates.filter((item) => item.daysUntilDue >= 0);
  const sourceTasks = upcomingTasks.length > 0 ? upcomingTasks : taskDates;

  return sourceTasks.reduce((nearestTask, currentTask) => {
    if (!nearestTask) {
      return currentTask;
    }

    return Math.abs(currentTask.daysUntilDue) < Math.abs(nearestTask.daysUntilDue)
      ? currentTask
      : nearestTask;
  }, null);
}

export function getStatisticsSummary(subjects, tasks) {
  const totalSubjects = subjects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(isCompletedTask).length;
  const pendingTasks = totalTasks - completedTasks;
  const subjectProgress = getSubjectProgress(subjects, tasks);

  return {
    totalSubjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate: getCompletionRate(completedTasks, totalTasks),
    topSubject: getTopSubjectByDeadline(subjects, tasks),
    nearestDeadline: getNearestDeadline(tasks),
    subjectProgress,
  };
}
