import { useState } from "react";

function getEmptyForm() {
  return {
    name: "",
    code: "",
    teacher: "",
    credits: "",
    description: "",
  };
}

function getFormValue(initialSubject) {
  if (!initialSubject) {
    return getEmptyForm();
  }

  return {
    name: initialSubject.name || "",
    code: initialSubject.code || "",
    teacher: initialSubject.teacher || "",
    credits: String(initialSubject.credits ?? ""),
    description: initialSubject.description || "",
  };
}

const inputClassName =
  "w-full rounded-2xl border border-blue-100 bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100";

function SubjectForm({
  mode = "add",
  initialSubject,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() => getFormValue(initialSubject));
  const isEditing = mode === "edit";

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
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      teacher: formData.teacher.trim(),
      credits: Number(formData.credits),
      description: formData.description.trim(),
    };

    if (!payload.name || !payload.code || !payload.teacher || !payload.credits) {
      return;
    }

    onSubmit(payload);
  };

  return (
    <section className="border border-blue-100 bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-lg font-black text-[#4f8edc]">
            {isEditing ? "S" : "+"}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
              {isEditing ? "Chỉnh sửa môn học" : "Môn học mới"}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {isEditing ? "Cập nhật thông tin" : "Thêm thông tin môn học"}
            </h2>
          </div>
        </div>

        <button
          type="button"
          aria-label="Đóng form"
          onClick={onCancel}
          disabled={isSubmitting}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-5"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block" htmlFor="subject-name">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Tên môn học
            </span>
            <input
              id="subject-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="Lập trình Web"
              className={inputClassName}
            />
          </label>

          <label className="block" htmlFor="subject-code">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Mã môn
            </span>
            <input
              id="subject-code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="WEB101"
              className={inputClassName}
            />
          </label>

          <label className="block" htmlFor="subject-teacher">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Giảng viên
            </span>
            <input
              id="subject-teacher"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="Nguyễn Văn A"
              className={inputClassName}
            />
          </label>

          <label className="block" htmlFor="subject-credits">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Số tín chỉ
            </span>
            <input
              id="subject-credits"
              name="credits"
              type="number"
              min="1"
              value={formData.credits}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="3"
              className={inputClassName}
            />
          </label>
        </div>

        <label className="block" htmlFor="subject-description">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Mô tả
          </span>
          <textarea
            id="subject-description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Môn học về lập trình giao diện web"
            className={`${inputClassName} resize-y`}
          />
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Đang lưu...
              </>
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Thêm môn học"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SubjectForm;
