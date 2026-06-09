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

function SubjectForm({ mode = "add", initialSubject, onSubmit, onCancel }) {
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

    if (!isEditing) {
      setFormData(getEmptyForm());
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {isEditing ? "Chỉnh sửa môn học" : "Thêm môn học"}
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          {isEditing ? "Cập nhật thông tin môn học" : "Tạo môn học mới"}
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subject-name" className="mb-2 block text-sm font-medium text-slate-700">
            Tên môn học
          </label>
          <input
            id="subject-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Lập trình Web"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div>
          <label htmlFor="subject-code" className="mb-2 block text-sm font-medium text-slate-700">
            Mã môn
          </label>
          <input
            id="subject-code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="WEB101"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="subject-teacher"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Giảng viên
          </label>
          <input
            id="subject-teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div>
          <label htmlFor="subject-credits" className="mb-2 block text-sm font-medium text-slate-700">
            Số tín chỉ
          </label>
          <input
            id="subject-credits"
            name="credits"
            type="number"
            min="1"
            value={formData.credits}
            onChange={handleChange}
            placeholder="3"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="subject-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Mô tả
          </label>
          <textarea
            id="subject-description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Môn học về lập trình giao diện web"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isEditing ? "Lưu thay đổi" : "Thêm môn học"}
          </button>

          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {isEditing ? "Hủy" : "Đóng"}
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default SubjectForm;
