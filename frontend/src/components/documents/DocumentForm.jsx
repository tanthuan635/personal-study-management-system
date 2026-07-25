import { useMemo, useRef, useState } from "react";

import { DOCUMENT_TYPE_OPTIONS } from "../../utils/storage";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_UPLOAD_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
];
const FILE_ACCEPT_VALUE = ALLOWED_UPLOAD_EXTENSIONS.map(
  (extension) => `.${extension}`,
).join(",");

function getDefaultSubjectId(subjects) {
  return subjects.length > 0 ? String(subjects[0]._id) : "";
}

function getFormValue(initialDocument, subjects) {
  if (!initialDocument) {
    return {
      title: "",
      subject: getDefaultSubjectId(subjects),
      fileName: "",
      fileType: DOCUMENT_TYPE_OPTIONS[0],
      description: "",
    };
  }

  return {
    title: initialDocument.title || "",
    subject: String(initialDocument.subject ?? getDefaultSubjectId(subjects)),
    fileName: initialDocument.fileName || "",
    fileType: initialDocument.fileType || DOCUMENT_TYPE_OPTIONS[0],
    description: initialDocument.description || "",
  };
}

function getFileExtension(fileName) {
  const extensionIndex = fileName.lastIndexOf(".");

  return extensionIndex === -1
    ? ""
    : fileName.slice(extensionIndex + 1).toLowerCase();
}

function validateUploadFile(file) {
  if (!ALLOWED_UPLOAD_EXTENSIONS.includes(getFileExtension(file.name))) {
    return "Chỉ chấp nhận PDF, DOC, DOCX, PPT, PPTX hoặc file ảnh JPG, PNG, GIF, WEBP.";
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return "Dung lượng file không được vượt quá 10MB.";
  }

  return "";
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentForm({
  mode = "add",
  initialDocument,
  subjects,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    getFormValue(initialDocument, subjects),
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const isEditing = mode === "edit";

  const selectedSubjectExists = useMemo(() => {
    return subjects.some((subject) => String(subject._id) === formData.subject);
  }, [formData.subject, subjects]);

  const hasValidSource = selectedFile
    ? !fileError
    : Boolean(formData.fileName.trim() && formData.fileType);

  const isFormValid = Boolean(
    formData.title.trim() &&
      formData.subject &&
      selectedSubjectExists &&
      hasValidSource,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      setFileError("");
      return;
    }

    setSelectedFile(file);
    setFileError(validateUploadFile(file));
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    if (selectedFile && !isEditing) {
      const uploadData = new FormData();
      uploadData.append("title", formData.title.trim());
      uploadData.append("subject", formData.subject);
      uploadData.append("description", formData.description.trim());
      uploadData.append("file", selectedFile);
      onSubmit(uploadData);
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      subject: formData.subject,
      fileName: formData.fileName.trim(),
      fileType: formData.fileType,
      description: formData.description.trim(),
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {isEditing ? "Chỉnh sửa tài liệu" : "Thêm tài liệu"}
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          {isEditing
            ? "Cập nhật thông tin tài liệu"
            : "Tải file hoặc lưu metadata tài liệu"}
        </h2>
      </div>

      {subjects.length === 0 && !isEditing ? (
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
              disabled={isSubmitting}
              placeholder="Slide React cơ bản"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
        </div>

        {!isEditing ? (
          <div>
            <label
              htmlFor="document-file"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              File tài liệu
            </label>
            <input
              ref={fileInputRef}
              id="document-file"
              name="file"
              type="file"
              accept={FILE_ACCEPT_VALUE}
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Tối đa 10MB. Hỗ trợ PDF, Word, PowerPoint và ảnh cơ bản. Bỏ
              trống để chỉ lưu metadata.
            </p>

            {selectedFile ? (
              <div className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {selectedFile.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearSelectedFile}
                  disabled={isSubmitting}
                  className="w-fit rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Bỏ chọn file
                </button>
              </div>
            ) : null}

            {fileError ? (
              <p role="alert" className="mt-2 text-sm font-medium text-rose-600">
                {fileError}
              </p>
            ) : null}
          </div>
        ) : null}

        {!selectedFile ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label
                htmlFor="document-file-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tên file metadata
              </label>
              <input
                id="document-file-name"
                name="fileName"
                value={formData.fileName}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="react-basic.pdf"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
                name="fileType"
                value={formData.fileType}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {DOCUMENT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

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
            disabled={isSubmitting}
            placeholder="Tài liệu học React"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          {isEditing
            ? "Trang sửa hiện cập nhật metadata và giữ nguyên file đã upload."
            : selectedFile
              ? "File sẽ được tải lên máy chủ khi bạn gửi form."
              : "Chưa chọn file thật: hệ thống sẽ chỉ lưu tên và loại tài liệu."}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-900"
          >
            {isSubmitting
              ? selectedFile
                ? "Đang tải lên..."
                : "Đang lưu..."
              : isEditing
                ? "Lưu thay đổi"
                : selectedFile
                  ? "Tải tài liệu lên"
                  : "Thêm tài liệu"}
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

export default DocumentForm;
