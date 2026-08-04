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

const inputClassName =
  "w-full rounded-2xl border border-blue-100 bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100";

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
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef(null);
  const isEditing = mode === "edit";

  const selectedSubjectExists = useMemo(() => {
    return subjects.some((subject) => String(subject._id) === formData.subject);
  }, [formData.subject, subjects]);

  const hasValidSource = selectedFile
    ? !fileError
    : Boolean(formData.fileName.trim() && formData.fileType);
  const automaticTitle = selectedFile?.name || formData.fileName.trim();

  const isFormValid = Boolean(
    (isEditing ? formData.title.trim() : automaticTitle) &&
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

  const selectFile = (file) => {
    if (!file) {
      setSelectedFile(null);
      setFileError("");
      return;
    }

    setSelectedFile(file);
    setFileError(validateUploadFile(file));
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0] || null);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDraggingFile(false);

    if (!isSubmitting) {
      selectFile(event.dataTransfer.files?.[0] || null);
    }
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
      uploadData.append("title", selectedFile.name);
      uploadData.append("subject", formData.subject);
      uploadData.append("description", formData.description.trim());
      uploadData.append("file", selectedFile);
      onSubmit(uploadData);
      return;
    }

    onSubmit({
      title: isEditing ? formData.title.trim() : formData.fileName.trim(),
      subject: formData.subject,
      fileName: formData.fileName.trim(),
      fileType: formData.fileType,
      description: formData.description.trim(),
    });
  };

  return (
    <section className="rounded-[2rem] border border-blue-100 bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#4f8edc]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
              <path d="M6 3h8l4 4v14H6z" />
              <path d="M14 3v5h5M9 13h6M9 17h6" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
              {isEditing ? "Chỉnh sửa tài liệu" : "Tài liệu mới"}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {isEditing
                ? "Cập nhật thông tin tài liệu"
                : "Tải file hoặc lưu metadata"}
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {subjects.length === 0 && !isEditing ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Cần có ít nhất một môn học trước khi thêm tài liệu.
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className={`grid gap-5 ${isEditing ? "sm:grid-cols-2" : ""}`}>
          {isEditing ? (
            <label className="block" htmlFor="document-title">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Tên tài liệu</span>
              <input
                id="document-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                placeholder="Slide React cơ bản"
                className={inputClassName}
              />
            </label>
          ) : null}

          <label className="block" htmlFor="document-subject">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Môn học</span>
            <select
              id="document-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className={inputClassName}
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
          </label>
        </div>

        {!isEditing ? (
          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700">File tài liệu</span>
            <label
              htmlFor="document-file"
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              className={`block cursor-pointer rounded-2xl border-2 border-dashed px-5 py-7 text-center transition ${
                isDraggingFile
                  ? "border-[#4f8edc] bg-blue-100/70"
                  : selectedFile
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-blue-200 bg-[#f7fbff] hover:border-[#79b8f3] hover:bg-blue-50"
              } ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
            >
              <input
                ref={fileInputRef}
                id="document-file"
                name="file"
                type="file"
                accept={FILE_ACCEPT_VALUE}
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="sr-only"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </span>
                  <p className="mt-3 max-w-full truncate text-sm font-bold text-slate-800">{selectedFile.name}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white text-[#4f8edc] shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6">
                      <path d="M12 16V4M7 9l5-5 5 5M5 14v6h14v-6" />
                    </svg>
                  </span>
                  <p className="mt-3 text-sm font-bold text-slate-700">Kéo thả file vào đây hoặc nhấn để chọn</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">PDF, Word, PowerPoint hoặc ảnh · Tối đa 10MB</p>
                </div>
              )}
            </label>

            {selectedFile ? (
              <button
                type="button"
                onClick={clearSelectedFile}
                disabled={isSubmitting}
                className="mt-3 text-sm font-bold text-rose-600 transition hover:text-rose-700 disabled:opacity-60"
              >
                Bỏ file đã chọn
              </button>
            ) : null}

            {fileError ? (
              <p role="alert" className="mt-2 text-sm font-semibold text-rose-600">
                {fileError}
              </p>
            ) : null}
          </div>
        ) : null}

        {!selectedFile ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block" htmlFor="document-file-name">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Tên file metadata</span>
              <input
                id="document-file-name"
                name="fileName"
                value={formData.fileName}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                placeholder="react-basic.pdf"
                className={inputClassName}
              />
            </label>

            <label className="block" htmlFor="document-type">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Loại tài liệu</span>
              <select
                id="document-type"
                name="fileType"
                value={formData.fileType}
                onChange={handleChange}
                disabled={isSubmitting}
                className={inputClassName}
              >
                {DOCUMENT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        <label className="block" htmlFor="document-description">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Mô tả</span>
          <textarea
            id="document-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Nội dung chính của tài liệu..."
            className={`${inputClassName} resize-y`}
          />
        </label>

        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5 text-sm text-blue-700">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white font-black shadow-sm">i</span>
          <p className="pt-0.5 leading-5">
            {isEditing
              ? "Trang sửa chỉ cập nhật metadata và giữ nguyên file đã upload."
              : selectedFile
                ? `Tên tài liệu sẽ tự động lấy theo tên file: ${selectedFile.name}`
                : "Chưa chọn file thật: tên tài liệu sẽ lấy từ tên file metadata."}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {selectedFile ? "Đang tải lên..." : "Đang lưu..."}
              </>
            ) : isEditing ? "Lưu thay đổi" : selectedFile ? "Tải tài liệu lên" : "Thêm tài liệu"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default DocumentForm;
