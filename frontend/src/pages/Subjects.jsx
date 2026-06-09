import { useEffect, useMemo, useState } from "react";

import SubjectForm from "../components/subjects/SubjectForm";
import SubjectList from "../components/subjects/SubjectList";
import { getNextSubjectId, loadSubjects, saveSubjects } from "../utils/storage";

function Subjects() {
  const [subjects, setSubjects] = useState(() => loadSubjects());
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return subjects;
    }

    return subjects.filter((subject) => {
      const searchableText = [
        subject.name,
        subject.code,
        subject.teacher,
        subject.description,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [searchTerm, subjects]);

  const isFormVisible = isAddFormVisible || Boolean(editingSubject);

  const openAddForm = () => {
    setEditingSubject(null);
    setIsAddFormVisible(true);
  };

  const closeForm = () => {
    setEditingSubject(null);
    setIsAddFormVisible(false);
  };

  const handleSubmit = (subjectData) => {
    if (editingSubject) {
      setSubjects((currentSubjects) =>
        currentSubjects.map((subject) =>
          subject.id === editingSubject.id
            ? { ...subject, ...subjectData }
            : subject,
        ),
      );
      closeForm();
      return;
    }

    setSubjects((currentSubjects) => {
      const nextSubject = {
        id: getNextSubjectId(currentSubjects),
        ...subjectData,
      };

      return [...currentSubjects, nextSubject];
    });

    setIsAddFormVisible(false);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setIsAddFormVisible(true);
  };

  const handleDelete = (subjectId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa môn học này không?");

    if (!shouldDelete) {
      return;
    }

    setSubjects((currentSubjects) =>
      currentSubjects.filter((subject) => subject.id !== subjectId),
    );

    if (editingSubject?.id === subjectId) {
      closeForm();
    }
  };

  const totalSubjects = subjects.length;
  const visibleSubjects = filteredSubjects.length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Quản lý môn học
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Danh sách môn học
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Thêm, sửa, xóa và tìm kiếm môn học. Dữ liệu được lưu tạm vào localStorage.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-sm">
          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Tìm kiếm môn học
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tên môn, mã môn, giảng viên..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <button
            type="button"
            onClick={isFormVisible ? closeForm : openAddForm}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isFormVisible ? "Đóng form" : "Thêm môn học"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Tổng môn học</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {totalSubjects}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Kết quả lọc</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {visibleSubjects}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Chế độ</p>
          <p className="mt-2 text-base font-semibold tracking-tight text-slate-900">
            {editingSubject ? "Đang chỉnh sửa" : isAddFormVisible ? "Đang thêm mới" : "Đang ẩn form"}
          </p>
        </div>
      </section>

      {isFormVisible ? (
        <SubjectForm
          key={editingSubject ? `edit-${editingSubject.id}` : "add-subject"}
          mode={editingSubject ? "edit" : "add"}
          initialSubject={editingSubject}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold tracking-tight text-slate-900">
            Chưa mở form thêm môn học
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Nhấn nút <span className="font-medium text-slate-700">Thêm môn học</span> để nhập dữ liệu mới.
          </p>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Môn học hiện có
            </h2>
            <p className="text-sm text-slate-500">
              {visibleSubjects} / {totalSubjects} môn học đang hiển thị
            </p>
          </div>
        </div>

        <SubjectList subjects={filteredSubjects} onEdit={handleEdit} onDelete={handleDelete} />
      </section>
    </div>
  );
}

export default Subjects;
