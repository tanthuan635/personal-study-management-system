import EmptyState from "../ui/EmptyState";
import SubjectCard from "./SubjectCard";

function SubjectList({
  subjects,
  hasSubjects,
  hasActiveFilters,
  onEdit,
  onDelete,
}) {
  if (subjects.length === 0) {
    return (
      <EmptyState
        title={
          hasSubjects && hasActiveFilters
            ? "Không tìm thấy môn học phù hợp."
            : "Chưa có môn học nào."
        }
        description={
          hasSubjects && hasActiveFilters
            ? "Hãy thử đổi từ khóa tìm kiếm hoặc xóa bộ lọc hiện tại."
            : "Nhấn nút Thêm môn học để tạo môn học đầu tiên."
        }
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default SubjectList;
