import { useEffect, useMemo, useState } from "react";

import DocumentForm from "../components/documents/DocumentForm";
import DocumentList from "../components/documents/DocumentList";
import Toast from "../components/ui/Toast";
import {
  getNextDocumentId,
  loadDocuments,
  loadSubjects,
  saveDocuments,
} from "../utils/storage";

function Documents() {
  const [documents, setDocuments] = useState(() => loadDocuments());
  const [subjects] = useState(() => loadSubjects());
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [Number(subject.id), subject]));
  }, [subjects]);

  const filteredDocuments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return documents.filter((documentItem) => {
      const subject = subjectMap.get(Number(documentItem.subjectId));
      const matchesSubject =
        !subjectFilter || String(documentItem.subjectId) === subjectFilter;

      if (!matchesSubject) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchableText = [
        documentItem.title,
        documentItem.fileName,
        documentItem.type,
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
    return new Set(documents.map((documentItem) => documentItem.type)).size;
  }, [documents]);

  const showFeedback = (type, message) => {
    setFeedback({ id: Date.now(), type, message });
  };

  const hasActiveFilters = Boolean(searchTerm.trim() || subjectFilter);
  const addButtonLabel = isFormVisible ? "Đóng form" : "Thêm tài liệu";

  const handleSubmit = (documentData) => {
    try {
      setDocuments((currentDocuments) => {
        const nextDocument = {
          id: getNextDocumentId(currentDocuments),
          ...documentData,
        };

        return [...currentDocuments, nextDocument];
      });

      setIsFormVisible(false);
      showFeedback("success", "Đã thêm tài liệu.");
    } catch {
      showFeedback("error", "Không thể lưu tài liệu. Thử lại giúp mình nhé.");
    }
  };

  const handleDelete = (documentId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa tài liệu này không?");

    if (!shouldDelete) {
      return;
    }

    try {
      setDocuments((currentDocuments) =>
        currentDocuments.filter((documentItem) => documentItem.id !== documentId),
      );
      showFeedback("success", "Đã xóa tài liệu.");
    } catch {
      showFeedback("error", "Không thể xóa tài liệu. Thử lại giúp mình nhé.");
    }
  };

  return (
    <div className="space-y-6">
      <Toast feedback={feedback} onClose={() => setFeedback(null)} />

      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Quản lý tài liệu
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Danh sách tài liệu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Lưu tên file, phân loại theo môn học và tìm kiếm tài liệu học tập.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-sm">
          <button
            type="button"
            onClick={() => setIsFormVisible((current) => !current)}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {addButtonLabel}
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Tổng tài liệu</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {documents.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Đang hiển thị</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {filteredDocuments.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Loại tài liệu</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {typeCount}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Tìm kiếm tài liệu
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tên tài liệu, tên file, loại file..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Lọc theo môn học
            </span>
            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {isFormVisible ? (
        <DocumentForm
          subjects={subjects}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormVisible(false)}
        />
      ) : null}

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

        <DocumentList
          documents={filteredDocuments}
          subjects={subjects}
          hasActiveFilters={hasActiveFilters}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
}

export default Documents;
