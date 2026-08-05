function SubjectCard({ subject, onEdit, onDelete, isDeleting = false }) {
  const subjectCode = subject.code || "N/A";
  const subjectMark = subjectCode.slice(0, 2).toUpperCase();

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100/60">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#79b8f3] to-[#4f8edc]" />

      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-xs font-black tracking-wide text-[#4f8edc]">
          {subjectMark}
        </span>
        <span className="shrink-0 rounded-full border border-blue-100 bg-[#f7fbff] px-3 py-1 text-xs font-bold text-slate-600">
          {subject.credits} tín chỉ
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
          {subjectCode}
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          {subject.name}
        </h3>
      </div>

      <div className="mt-5 rounded-2xl bg-[#f7fbff] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Giảng viên
        </p>
        <p className="mt-1.5 text-sm font-semibold text-slate-700">
          {subject.teacher}
        </p>
      </div>

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
        {subject.description || "Chưa có mô tả cho môn học này."}
      </p>

      <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(subject)}
          disabled={isDeleting}
          className="flex-1 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-bold text-[#3979c2] transition hover:border-blue-200 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(subject._id)}
          disabled={isDeleting}
          className="flex-1 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </article>
  );
}

export default SubjectCard;
