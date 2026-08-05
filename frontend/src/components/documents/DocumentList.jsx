import { useMemo } from "react";

import DocumentCard from "./DocumentCard";

function DocumentList({
  documents,
  subjects,
  hasActiveFilters,
  onEdit,
  onDelete,
  deletingDocumentId,
}) {
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [String(subject._id), subject]));
  }, [subjects]);

  if (documents.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-blue-200 bg-blue-50/40 px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#4f8edc] shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6">
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v5h5M9 13h6M9 17h4" />
          </svg>
        </span>
        <p className="mt-4 text-base font-bold text-slate-700">
          {hasActiveFilters
            ? "Không tìm thấy tài liệu phù hợp"
            : "Chưa có tài liệu nào"}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {hasActiveFilters
            ? "Hãy đổi từ khóa, môn học hoặc xóa bộ lọc."
            : "Nhấn Thêm tài liệu để tạo tài liệu đầu tiên."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((documentItem) => (
        <DocumentCard
          key={documentItem._id}
          documentItem={documentItem}
          subject={subjectMap.get(String(documentItem.subject))}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingDocumentId === documentItem._id}
        />
      ))}
    </div>
  );
}

export default DocumentList;
