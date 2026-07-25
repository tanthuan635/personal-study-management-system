import { useEffect, useMemo, useState } from "react";

import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../api/subjectApi";
import SubjectForm from "../components/subjects/SubjectForm";
import SubjectList from "../components/subjects/SubjectList";

function getRequestErrorMessage(error, fallbackMessage) {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || fallbackMessage;
}

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSubjectId, setDeletingSubjectId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadSubjectList() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getSubjects();

        if (isActive) {
          setSubjects(response.data.data || []);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            getRequestErrorMessage(
              requestError,
              "Không thể tải danh sách môn học.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadSubjectList();

    return () => {
      isActive = false;
    };
  }, []);

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
    setError("");
    setMessage("");
    setEditingSubject(null);
    setIsAddFormVisible(true);
  };

  const closeForm = () => {
    if (isSubmitting) {
      return;
    }

    setEditingSubject(null);
    setIsAddFormVisible(false);
  };

  const handleSubmit = async (subjectData) => {
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (editingSubject) {
        const response = await updateSubject(editingSubject._id, subjectData);
        const updatedSubject = response.data.data;

        setSubjects((currentSubjects) =>
          currentSubjects.map((subject) =>
            subject._id === updatedSubject._id ? updatedSubject : subject,
          ),
        );
        setMessage("Cập nhật môn học thành công.");
      } else {
        const response = await createSubject(subjectData);
        const createdSubject = response.data.data;

        setSubjects((currentSubjects) => [createdSubject, ...currentSubjects]);
        setMessage("Thêm môn học thành công.");
      }

      setEditingSubject(null);
      setIsAddFormVisible(false);
      return true;
    } catch (requestError) {
      setError(
        getRequestErrorMessage(
          requestError,
          editingSubject
            ? "Không thể cập nhật môn học."
            : "Không thể thêm môn học.",
        ),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setError("");
    setMessage("");
    setEditingSubject(subject);
    setIsAddFormVisible(true);
  };

  const handleDelete = async (subjectId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa môn học này không?");

    if (!shouldDelete) {
      return;
    }

    setDeletingSubjectId(subjectId);
    setError("");
    setMessage("");

    try {
      await deleteSubject(subjectId);
      setSubjects((currentSubjects) =>
        currentSubjects.filter((subject) => subject._id !== subjectId),
      );

      if (editingSubject?._id === subjectId) {
        setEditingSubject(null);
        setIsAddFormVisible(false);
      }

      setMessage("Xóa môn học thành công.");
    } catch (requestError) {
      setError(
        getRequestErrorMessage(requestError, "Không thể xóa môn học."),
      );
    } finally {
      setDeletingSubjectId(null);
    }
  };

  const toggleForm = () => {
    if (isFormVisible) {
      closeForm();
      return;
    }

    openAddForm();
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
            Thêm, sửa, xóa và tìm kiếm môn học được lưu trong tài khoản của bạn.
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
            onClick={toggleForm}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isFormVisible ? "Đóng form" : "Thêm môn học"}
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
          key={editingSubject ? `edit-${editingSubject._id}` : "add-subject"}
          mode={editingSubject ? "edit" : "add"}
          initialSubject={editingSubject}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={isSubmitting}
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

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">
              Đang tải danh sách môn học...
            </p>
          </div>
        ) : (
          <SubjectList
            subjects={filteredSubjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isSearchActive={Boolean(searchTerm.trim())}
            deletingSubjectId={deletingSubjectId}
          />
        )}
      </section>
    </div>
  );
}

export default Subjects;
