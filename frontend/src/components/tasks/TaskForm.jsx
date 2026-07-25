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

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      title: formData.title.trim(),
      subject: formData.subject,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
      note: formData.note.trim(),
    };

    if (!isFormValid) {
      return;
    }

    onSubmit(payload);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {isEditing ? "Chỉnh sửa deadline" : "Thêm deadline"}
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          {isEditing ? "Cập nhật deadline" : "Tạo deadline mới"}
        </h2>
      </div>

      {subjects.length === 0 && !isEditing ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Cần có ít nhất một môn học trước khi thêm deadline mới.
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="task-title" className="mb-2 block text-sm font-medium text-slate-700">
            Tiêu đề
          </label>
          <input
            id="task-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Làm bài tập React"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div>
          <label htmlFor="task-subject" className="mb-2 block text-sm font-medium text-slate-700">
            Môn học
          </label>
          <select
            id="task-subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          >
            <option value="">Chọn môn học</option>
            {!selectedSubjectExists && formData.subject ? (
              <option value={formData.subject}>
                Môn đã bị xóa (#{formData.subject})
              </option>
            ) : null}
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-due-date" className="mb-2 block text-sm font-medium text-slate-700">
              Hạn nộp
            </label>
            <input
              id="task-due-date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div>
            <label htmlFor="task-priority" className="mb-2 block text-sm font-medium text-slate-700">
              Ưu tiên
            </label>
            <select
              id="task-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              {TASK_PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-status" className="mb-2 block text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <select
              id="task-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              {TASK_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-note" className="mb-2 block text-sm font-medium text-slate-700">
              Ghi chú
            </label>
            <input
              id="task-note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Hoàn thành component quản lý môn học"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-900"
          >
            {isSubmitting
              ? "Đang lưu..."
              : isEditing
                ? "Lưu thay đổi"
                : "Thêm deadline"}
          </button>

          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditing ? "Hủy" : "Đóng"}
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
