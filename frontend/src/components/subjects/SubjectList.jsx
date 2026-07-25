import SubjectCard from "./SubjectCard";

function SubjectList({
  subjects,
  onEdit,
  onDelete,
  isSearchActive = false,
  deletingSubjectId,
}) {
  if (subjects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-base font-medium text-slate-700">
          {isSearchActive
            ? "Không tìm thấy môn học phù hợp."
            : "Chưa có môn học nào."}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {isSearchActive
            ? "Hãy thử đổi từ khóa tìm kiếm."
            : "Nhấn Thêm môn học để tạo môn học đầu tiên."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject._id}
          subject={subject}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingSubjectId === subject._id}
        />
      ))}
    </div>
  );
}

export default SubjectList;
