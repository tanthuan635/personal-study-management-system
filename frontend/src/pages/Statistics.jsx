import { useMemo, useState } from "react";

import ProgressSummary from "../components/statistics/ProgressSummary";
import StatCard from "../components/statistics/StatCard";
import SubjectProgress from "../components/statistics/SubjectProgress";
import { loadSubjects, loadTasks } from "../utils/storage";
import { getStatisticsSummary } from "../utils/statistics";

function Statistics() {
  const [subjects] = useState(() => loadSubjects());
  const [tasks] = useState(() => loadTasks());

  const summary = useMemo(() => {
    return getStatisticsSummary(subjects, tasks);
  }, [subjects, tasks]);

  const sortedSubjectProgress = useMemo(() => {
    return [...summary.subjectProgress].sort((firstSubject, secondSubject) => {
      const taskDiff = secondSubject.totalTasks - firstSubject.totalTasks;

      if (taskDiff !== 0) {
        return taskDiff;
      }

      return firstSubject.subject.name.localeCompare(secondSubject.subject.name);
    });
  }, [summary.subjectProgress]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Thống kê học tập
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Tổng quan tiến độ
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Theo dõi môn học, deadline và tỷ lệ hoàn thành từ dữ liệu đang lưu tạm.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Tổng môn học" value={summary.totalSubjects} />
        <StatCard label="Tổng deadline" value={summary.totalTasks} tone="sky" />
        <StatCard
          label="Đã hoàn thành"
          value={summary.completedTasks}
          tone="emerald"
        />
        <StatCard
          label="Chưa hoàn thành"
          value={summary.pendingTasks}
          tone="amber"
        />
        <StatCard
          label="Tỷ lệ hoàn thành"
          value={`${summary.completionRate}%`}
          helper={`${summary.completedTasks}/${summary.totalTasks} deadline`}
          tone="emerald"
        />
      </section>

      <ProgressSummary summary={summary} subjects={subjects} />

      <SubjectProgress progressList={sortedSubjectProgress} />
    </div>
  );
}

export default Statistics;
