import { useState } from "react";

import { DOCUMENT_TYPE_OPTIONS } from "../../utils/storage";

function getTodayInputValue() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 10);
}

function getDefaultSubjectId(subjects) {
  return subjects.length > 0 ? String(subjects[0].id) : "";
}

function getEmptyForm(subjects) {
  return {
    title: "",
    subjectId: getDefaultSubjectId(subjects),
    fileName: "",
    type: DOCUMENT_TYPE_OPTIONS[0],
    uploadDate: getTodayInputValue(),
    description: "",
  };
}

function DocumentForm({ subjects, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => getEmptyForm(subjects));

  const isFormValid = Boolean(
    formData.title.trim() &&
      formData.subjectId &&
      formData.fileName.trim() &&
      formData.type &&
      formData.uploadDate,
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

    if (!isFormValid) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      subjectId: Number(formData.subjectId),
      fileName: formData.fileName.trim(),
      type: formData.type,
      uploadDate: formData.uploadDate,
      description: formData.description.trim(),
    });

    setFormData(getEmptyForm(subjects));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Thêm tài liệu
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          Lưu thông tin tài liệu mới
        </h2>
      </div>

      {subjects.length === 0 ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Cần có ít nhất một môn học trước khi thêm tài liệu.
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label
              htmlFor="document-title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Tên tài liệu
            </label>
            <input
              id="document-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Slide React cơ bản"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="document-subject"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Môn học
            </label>
            <select
              id="document-subject"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">Chọn môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label
              htmlFor="document-file-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Tên file
            </label>
            <input
              id="document-file-name"
              name="fileName"
              value={formData.fileName}
              onChange={handleChange}
              placeholder="react-basic.pdf"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="document-type"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Loại tài liệu
            </label>
            <select
              id="document-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              {DOCUMENT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="document-upload-date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Ngày lưu
            </label>
            <input
              id="document-upload-date"
              name="uploadDate"
              type="date"
              value={formData.uploadDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="document-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Mô tả
          </label>
          <textarea
            id="document-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tài liệu học React"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isFormValid}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-900"
          >
            Thêm tài liệu
          </button>

          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Đóng
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default DocumentForm;
