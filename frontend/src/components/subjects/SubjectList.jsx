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
      <div className="rounded-[2rem] border border-dashed border-blue-200 bg-blue-50/40 px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-2xl font-light text-[#4f8edc] shadow-sm">
          {isSearchActive ? "?" : "+"}
        </span>
        <p className="mt-4 text-base font-bold text-slate-700">
          {isSearchActive
            ? "Không tìm thấy môn học phù hợp"
            : "Chưa có môn học nào"}
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
