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

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [editingDocument, setEditingDocument] = useState(null);
  const [activeFormMode, setActiveFormMode] = useState(null);
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

  const hasActiveFilters = Boolean(searchTerm.trim() || subjectFilter);
  const isFormVisible = activeFormMode !== null;
  const addButtonLabel = activeFormMode === "add" ? "Đóng form" : "Thêm tài liệu";

  const openAddForm = () => {
    setError("");
    setMessage("");

    if (activeFormMode === "add") {
      setActiveFormMode(null);
      setEditingDocument(null);
      return;
    }

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

  const handleDelete = async (documentId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa tài liệu này không?");

    if (!shouldDelete) {
      return;
    }

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
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Quản lý tài liệu
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Danh sách tài liệu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tải file hoặc lưu metadata, phân loại theo môn học và tìm kiếm tài
            liệu học tập.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-sm">
          <button
            type="button"
            onClick={openAddForm}
            disabled={isLoading || isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {addButtonLabel}
          </button>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Tổng tài liệu</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {documents.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Đang hiển thị</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {filteredDocuments.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Loại tài liệu</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {typeCount}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Tìm kiếm tài liệu
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              disabled={isLoading}
              placeholder="Tên tài liệu, tên file, loại file..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Lọc theo môn học
            </span>
            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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
      </section>

      {isFormVisible ? (
        <DocumentForm
          key={editingDocument ? `edit-${editingDocument._id}` : "add-document"}
          mode={activeFormMode === "edit" ? "edit" : "add"}
          initialDocument={editingDocument}
          subjects={subjects}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={isSubmitting}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold tracking-tight text-slate-900">
            Chưa mở form thêm tài liệu
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Nhấn nút <span className="font-medium text-slate-700">Thêm tài liệu</span>{" "}
            để lưu thông tin file mới.
          </p>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Tài liệu hiện có
            </h2>
            <p className="text-sm text-slate-500">
              {filteredDocuments.length} / {documents.length} tài liệu đang hiển thị
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">
              Đang tải danh sách tài liệu...
            </p>
          </div>
        ) : (
          <DocumentList
            documents={filteredDocuments}
            subjects={subjects}
            hasActiveFilters={hasActiveFilters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingDocumentId={deletingDocumentId}
          />
        )}
      </section>
    </div>
  );
}

export default Documents;
