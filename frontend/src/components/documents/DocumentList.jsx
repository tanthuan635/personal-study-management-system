import { useMemo } from "react";

import DocumentCard from "./DocumentCard";

function DocumentList({ documents, subjects, hasActiveFilters, onDelete }) {
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [Number(subject.id), subject]));
  }, [subjects]);

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-base font-medium text-slate-700">
          {hasActiveFilters
            ? "Không tìm thấy tài liệu phù hợp."
            : "Chưa có tài liệu nào."}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {hasActiveFilters
            ? "Hãy đổi từ khóa hoặc bộ lọc môn học."
            : "Nhấn nút Thêm tài liệu để lưu tài liệu đầu tiên."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {documents.map((documentItem) => (
        <DocumentCard
          key={documentItem.id}
          documentItem={documentItem}
          subject={subjectMap.get(Number(documentItem.subjectId))}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default DocumentList;
