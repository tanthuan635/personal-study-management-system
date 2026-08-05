import { useMemo, useState } from "react";

import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../../utils/storage";

function getDefaultSubjectId(subjects) {
  return subjects.length > 0 ? String(subjects[0]._id) : "";
}

function getFormValue(initialTask, subjects) {
  if (!initialTask) {
    return {
      title: "",
      subject: getDefaultSubjectId(subjects),
      dueDate: "",
      priority: "Trung bình",
      status: "Chưa làm",
      note: "",
    };
  }

  return {
    title: initialTask.title || "",
    subject: String(initialTask.subject ?? getDefaultSubjectId(subjects)),
    dueDate: initialTask.dueDate ? String(initialTask.dueDate).slice(0, 10) : "",
    priority: initialTask.priority || "Trung bình",
    status: initialTask.status || "Chưa làm",
    note: initialTask.note || "",
  };
}

const inputClassName =
  "w-full rounded-2xl border border-blue-100 bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100";

function TaskForm({
  mode = "add",
  initialTask,
  subjects,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() => getFormValue(initialTask, subjects));
  const isEditing = mode === "edit";

  const selectedSubjectExists = useMemo(() => {
    return subjects.some((subject) => String(subject._id) === formData.subject);
  }, [formData.subject, subjects]);

  const isFormValid = Boolean(
    formData.title.trim() &&
      formData.subject &&
      selectedSubjectExists &&
      formData.dueDate &&
      formData.priority &&
      formData.status,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      subject: formData.subject,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
      note: formData.note.trim(),
    });
  };

  return (
    <section className="border border-blue-100 bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-xs font-black text-[#4f8edc]">DL</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">{isEditing ? "Chỉnh sửa deadline" : "Deadline mới"}</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">{isEditing ? "Cập nhật công việc" : "Thêm công việc cần làm"}</h2>
          </div>
        </div>
        <button type="button" aria-label="Đóng form" onClick={onCancel} disabled={isSubmitting} className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>

      {subjects.length === 0 && !isEditing ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">Cần có ít nhất một môn học trước khi thêm deadline mới.</div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block" htmlFor="task-title">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Tiêu đề</span>
          <input id="task-title" name="title" value={formData.title} onChange={handleChange} disabled={isSubmitting} required placeholder="Làm bài tập React" className={inputClassName} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block" htmlFor="task-subject">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Môn học</span>
            <select id="task-subject" name="subject" value={formData.subject} onChange={handleChange} disabled={isSubmitting} required className={inputClassName}>
              <option value="">Chọn môn học</option>
              {!selectedSubjectExists && formData.subject ? <option value={formData.subject}>Môn đã bị xóa (#{formData.subject})</option> : null}
              {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.code} - {subject.name}</option>)}
            </select>
          </label>
          <label className="block" htmlFor="task-due-date">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Hạn nộp</span>
            <input id="task-due-date" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} disabled={isSubmitting} required className={inputClassName} />
          </label>
          <label className="block" htmlFor="task-priority">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Mức ưu tiên</span>
            <select id="task-priority" name="priority" value={formData.priority} onChange={handleChange} disabled={isSubmitting} className={inputClassName}>
              {TASK_PRIORITY_OPTIONS.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </label>
          <label className="block" htmlFor="task-status">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</span>
            <select id="task-status" name="status" value={formData.status} onChange={handleChange} disabled={isSubmitting} className={inputClassName}>
              {TASK_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        </div>

        <label className="block" htmlFor="task-note">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Ghi chú</span>
          <textarea id="task-note" name="note" rows="4" value={formData.note} onChange={handleChange} disabled={isSubmitting} placeholder="Nội dung cần hoàn thành..." className={`${inputClassName} resize-y`} />
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60">Hủy</button>
          <button type="submit" disabled={!isFormValid || isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none">
            {isSubmitting ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Đang lưu...</> : isEditing ? "Lưu thay đổi" : "Thêm deadline"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
