function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {subject.code}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
            {subject.name}
          </h3>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {subject.credits} tín chỉ
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Giảng viên</dt>
          <dd>{subject.teacher}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Mã môn</dt>
          <dd>{subject.code}</dd>
        </div>
      </dl>

      <p className="mt-4 flex-1 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        {subject.description}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onEdit(subject)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(subject.id)}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
        >
          Xóa
        </button>
      </div>
    </article>
  );
}

export default SubjectCard;
