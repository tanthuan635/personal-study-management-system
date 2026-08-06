import { useEffect, useMemo, useState } from "react";

import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../api/documentApi";
import { getSubjects } from "../api/subjectApi";
import DocumentForm from "../components/documents/DocumentForm";
import DocumentList from "../components/documents/DocumentList";

function getRequestErrorMessage(error, fallbackMessage) {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  const serverMessage = error.response.data?.message;
  const uploadErrorMessages = {
    "File size must not exceed 10MB":
      "Dung lượng file không được vượt quá 10MB.",
    "Invalid document upload": "File tải lên không hợp lệ.",
    "Only PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, GIF and WEBP files are allowed":
      "Định dạng file không được hỗ trợ.",
  };

  return uploadErrorMessages[serverMessage] || serverMessage || fallbackMessage;
}

function Toast({ type, children, onClose }) {
  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
        isSuccess
          ? "border-emerald-200 shadow-emerald-900/10"
          : "border-rose-200 shadow-rose-900/10"
      }`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full ${
          isSuccess
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {isSuccess ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
            <path d="m5 12 4 4L19 6" />
          </svg>
        ) : (
          <span className="text-sm font-black">!</span>
        )}
      </span>
      <p className={`min-w-0 flex-1 pt-1 text-sm font-semibold leading-6 ${isSuccess ? "text-emerald-700" : "text-rose-700"}`}>
        {children}
      </p>
      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={onClose}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-4">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [editingDocument, setEditingDocument] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDocumentData() {
      setIsLoading(true);
      setError("");

      try {
        const [documentResponse, subjectResponse] = await Promise.all([
          getDocuments(),
          getSubjects(),
        ]);

        if (isActive) {
          setDocuments(documentResponse.data.data || []);
          setSubjects(subjectResponse.data.data || []);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            getRequestErrorMessage(
              requestError,
              "Không thể tải dữ liệu tài liệu.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDocumentData();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setMessage(""), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [String(subject._id), subject]));
  }, [subjects]);

  const filteredDocuments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return documents.filter((documentItem) => {
      const subject = subjectMap.get(String(documentItem.subject));
      const matchesSubject =
        !subjectFilter || String(documentItem.subject) === subjectFilter;

      if (!matchesSubject) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchableText = [
        documentItem.title,
        documentItem.fileName,
        documentItem.fileType,
        documentItem.description,
        subject?.name,
        subject?.code,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [documents, searchTerm, subjectFilter, subjectMap]);

  const typeCount = useMemo(() => {
    return new Set(
      documents.map((documentItem) => documentItem.fileType).filter(Boolean),
    ).size;
  }, [documents]);

  const uploadedCount = useMemo(() => {
    return documents.filter((documentItem) => documentItem.fileUrl).length;
  }, [documents]);

  const hasActiveFilters = Boolean(searchTerm.trim() || subjectFilter);
  const isFormVisible = activeFormMode !== null;

  const openAddForm = () => {
    if (isSubmitting) {
      return;
    }

    setError("");
    setMessage("");
    setEditingDocument(null);
    setActiveFormMode("add");
  };

  const closeForm = () => {
    if (isSubmitting) {
      return;
    }

    setEditingDocument(null);
    setActiveFormMode(null);
  };

  const handleSubmit = async (documentData) => {
    const isUploadingFile = documentData instanceof FormData;

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (activeFormMode === "edit" && editingDocument) {
        const response = await updateDocument(
          editingDocument._id,
          documentData,
        );
        const updatedDocument = response.data.data;

        setDocuments((currentDocuments) =>
          currentDocuments.map((documentItem) =>
            documentItem._id === updatedDocument._id
              ? updatedDocument
              : documentItem,
          ),
        );
        setMessage("Cập nhật tài liệu thành công.");
      } else {
        const response = await createDocument(documentData);
        const createdDocument = response.data.data;

        setDocuments((currentDocuments) => [
          createdDocument,
          ...currentDocuments,
        ]);
        setMessage(
          isUploadingFile
            ? "Tải tài liệu lên thành công."
            : "Thêm metadata tài liệu thành công.",
        );
      }

      setEditingDocument(null);
      setActiveFormMode(null);
      return true;
    } catch (requestError) {
      setError(
        getRequestErrorMessage(
          requestError,
          activeFormMode === "edit"
            ? "Không thể cập nhật tài liệu."
            : "Không thể thêm tài liệu.",
        ),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (documentItem) => {
    setError("");
    setMessage("");
    setEditingDocument(documentItem);
    setActiveFormMode("edit");
  };

  const openDeleteDialog = (documentId) => {
    const selectedDocument = documents.find(
      (documentItem) => documentItem._id === documentId,
    );

    if (!selectedDocument) {
      return;
    }

    setError("");
    setMessage("");
    setDocumentToDelete(selectedDocument);
  };

  const closeDeleteDialog = () => {
    if (!deletingDocumentId) {
      setDocumentToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!documentToDelete) {
      return;
    }

    const documentId = documentToDelete._id;
    setDeletingDocumentId(documentId);
    setError("");
    setMessage("");

    try {
      await deleteDocument(documentId);
      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (documentItem) => documentItem._id !== documentId,
        ),
      );

      if (editingDocument?._id === documentId) {
        setEditingDocument(null);
        setActiveFormMode(null);
      }

      setMessage("Xóa tài liệu thành công.");
    } catch (requestError) {
      setError(
        getRequestErrorMessage(requestError, "Không thể xóa tài liệu."),
      );
    } finally {
      setDeletingDocumentId(null);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {message || error ? (
        <div
          aria-live="polite"
          className="pointer-events-none fixed left-4 right-4 top-4 z-[90] flex flex-col gap-3 sm:left-auto sm:w-full sm:max-w-sm"
        >
          {message ? (
            <Toast type="success" onClose={() => setMessage("")}>
              {message}
            </Toast>
          ) : null}
          {error ? (
            <Toast type="error" onClose={() => setError("")}>
              {error}
            </Toast>
          ) : null}
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_60%,#ffffff_100%)] px-6 py-7 shadow-sm shadow-blue-100/50 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border-[26px] border-white/50" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-blue-200/70 bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#4f8edc]">
              Thư viện học tập
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Tài liệu của bạn
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Lưu trữ, phân loại và tìm lại file học tập theo từng môn một cách nhanh chóng.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-2xl border border-white/80 bg-white/65 px-5 py-3 text-center shadow-sm backdrop-blur">
              <p className="text-2xl font-black text-[#4f8edc]">{documents.length}</p>
              <p className="text-xs font-medium text-slate-500">Tài liệu</p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              disabled={isLoading || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4f8edc] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <span className="text-xl font-light leading-none">+</span>
              Thêm tài liệu
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng tài liệu", documents.length, "TL", "bg-blue-50 text-blue-600"],
          ["Đã tải file", uploadedCount, "UP", "bg-emerald-50 text-emerald-700"],
          ["Chỉ metadata", documents.length - uploadedCount, "MD", "bg-amber-50 text-amber-700"],
          ["Loại tài liệu", typeCount, "LO", "bg-violet-50 text-violet-700"],
        ].map(([label, value, code, tone]) => (
          <article
            key={label}
            className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</p>
              </div>
              <span className={`grid size-11 place-items-center rounded-2xl text-xs font-black ${tone}`}>
                {code}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/30 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="mr-auto">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Tìm kiếm</p>
            <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900">Tìm tài liệu cần dùng</h2>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-3xl xl:grid-cols-[1fr,280px]">
            <label className="relative">
              <span className="sr-only">Tìm kiếm tài liệu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                disabled={isLoading}
                placeholder="Tên tài liệu, tên file, loại file..."
                className="w-full rounded-2xl border border-blue-100 bg-[#f7fbff] py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </label>

            <label>
              <span className="sr-only">Lọc theo môn học</span>
              <select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                disabled={isLoading}
                className="w-full rounded-2xl border border-blue-100 bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-800 outline-none transition hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">Tất cả môn học</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSubjectFilter("");
            }}
            disabled={!hasActiveFilters}
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Xóa bộ lọc
          </button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Kho tài liệu</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">Tài liệu hiện có</h2>
          </div>
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-bold text-slate-800">{filteredDocuments.length}</span> / {documents.length} tài liệu
          </p>
        </div>

        {isLoading ? (
          <div aria-label="Đang tải danh sách tài liệu" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-2xl border border-blue-100 bg-white p-5">
                <div className="h-12 w-12 rounded-2xl bg-blue-100" />
                <div className="mt-5 h-6 w-2/3 rounded bg-slate-100" />
                <div className="mt-4 h-16 rounded-2xl bg-blue-50" />
                <div className="mt-5 h-4 w-1/2 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <DocumentList
            documents={filteredDocuments}
            subjects={subjects}
            hasActiveFilters={hasActiveFilters}
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
            deletingDocumentId={deletingDocumentId}
          />
        )}
      </section>

      {isFormVisible ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Đóng form tài liệu"
            onClick={closeForm}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingDocument ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] shadow-2xl shadow-slate-950/20"
          >
            <DocumentForm
              key={editingDocument ? `edit-${editingDocument._id}` : "add-document"}
              mode={activeFormMode === "edit" ? "edit" : "add"}
              initialDocument={editingDocument}
              subjects={subjects}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      ) : null}

      {documentToDelete ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Đóng xác nhận xóa"
            onClick={closeDeleteDialog}
            disabled={Boolean(deletingDocumentId)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm disabled:cursor-wait"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-document-title"
            aria-describedby="delete-document-description"
            className="relative w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-7"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-7">
                <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
              </svg>
            </span>
            <h2 id="delete-document-title" className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Xóa tài liệu?
            </h2>
            <p id="delete-document-description" className="mt-3 text-sm leading-6 text-slate-500">
              Bạn sắp xóa <span className="font-bold text-slate-800">{documentToDelete.title}</span>. File đã tải lên cũng có thể bị xóa khỏi máy chủ và không thể khôi phục.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={Boolean(deletingDocumentId)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingDocumentId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-700 disabled:bg-rose-300"
              >
                {deletingDocumentId ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Đang xóa...
                  </>
                ) : "Xóa tài liệu"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Documents;
