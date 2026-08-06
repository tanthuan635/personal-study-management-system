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

function Toast({ type, children, onClose }) {
  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
        isSuccess
          ? "border-emerald-200 shadow-emerald-900/10"
          : "border-red-200 shadow-red-900/10"
      }`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-black ${
          isSuccess
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isSuccess ? "✓" : "!"}
      </span>
      <p
        className={`min-w-0 flex-1 pt-1 text-sm font-semibold leading-6 ${
          isSuccess ? "text-emerald-700" : "text-red-700"
        }`}
      >
        {children}
      </p>
      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={onClose}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSubjectId, setDeletingSubjectId] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
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

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage("");
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [message]);

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

  const openDeleteDialog = (subjectId) => {
    const selectedSubject = subjects.find(
      (subject) => subject._id === subjectId,
    );

    if (!selectedSubject) {
      return;
    }

    setError("");
    setMessage("");
    setSubjectToDelete(selectedSubject);
  };

  const closeDeleteDialog = () => {
    if (deletingSubjectId) {
      return;
    }

    setSubjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) {
      return;
    }

    const subjectId = subjectToDelete._id;
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
      setSubjectToDelete(null);
    }
  };

  const totalSubjects = subjects.length;
  const visibleSubjects = filteredSubjects.length;

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
              Quản lý môn học
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Danh sách môn học
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Lưu thông tin môn học, giảng viên và số tín chỉ để quản lý kế hoạch
              học tập rõ ràng hơn.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-2xl border border-white/80 bg-white/65 px-5 py-3 text-center shadow-sm backdrop-blur">
              <p className="text-2xl font-black text-[#4f8edc]">
                {totalSubjects}
              </p>
              <p className="text-xs font-medium text-slate-500">Môn học</p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4f8edc] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#4383ce] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <span className="text-xl font-light leading-none">+</span>
              Thêm môn học
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/30 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-xl">
            <span className="sr-only">Tìm kiếm môn học</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, mã môn hoặc giảng viên..."
              className="w-full rounded-2xl border border-blue-100 bg-[#f7fbff] py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-[#79b8f3] focus:bg-white focus:ring-4 focus:ring-blue-100/70"
            />
          </label>

          <p className="shrink-0 text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">{visibleSubjects}</span> /{" "}
            {totalSubjects} môn
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
            Môn học của bạn
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            Thông tin môn học hiện có
          </h2>
        </div>

        {isLoading ? (
          <div
            aria-label="Đang tải danh sách môn học"
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-blue-100 bg-white p-5"
              >
                <div className="h-5 w-20 rounded bg-blue-100" />
                <div className="mt-5 h-7 w-2/3 rounded bg-slate-100" />
                <div className="mt-6 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-5 h-20 rounded-2xl bg-blue-50" />
              </div>
            ))}
          </div>
        ) : (
          <SubjectList
            subjects={filteredSubjects}
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
            isSearchActive={Boolean(searchTerm.trim())}
            deletingSubjectId={deletingSubjectId}
          />
        )}
      </section>

      {isFormVisible ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Đóng form môn học"
            onClick={closeForm}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              editingSubject ? "Chỉnh sửa môn học" : "Thêm môn học mới"
            }
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] shadow-2xl shadow-slate-950/20"
          >
            <SubjectForm
              key={
                editingSubject ? `edit-${editingSubject._id}` : "add-subject"
              }
              mode={editingSubject ? "edit" : "add"}
              initialSubject={editingSubject}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      ) : null}

      {subjectToDelete ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Đóng xác nhận xóa"
            onClick={closeDeleteDialog}
            disabled={Boolean(deletingSubjectId)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm disabled:cursor-wait"
          />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-subject-title"
            aria-describedby="delete-subject-description"
            className="relative w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-7"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-7"
              >
                <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
              </svg>
            </span>

            <h2
              id="delete-subject-title"
              className="mt-5 text-2xl font-bold tracking-tight text-slate-900"
            >
              Xóa môn học?
            </h2>
            <p
              id="delete-subject-description"
              className="mt-3 text-sm leading-6 text-slate-500"
            >
              Bạn sắp xóa môn{" "}
              <span className="font-bold text-slate-800">
                {subjectToDelete.name}
              </span>
              . Dữ liệu đã xóa không thể khôi phục.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={Boolean(deletingSubjectId)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingSubjectId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
              >
                {deletingSubjectId ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa môn học"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Subjects;
